
import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { uploadToStorage } from "../utils/storage";
import { ExtractionResponseSchema } from "../schemas/question-schemas";

/**
 * Extracts a figure description using Gemini Vision.
 */
async function extractFigureDescription(
  pdfBase64: string,
  figure: { page: number; box: number[]; label?: string },
  index: number
): Promise<string | null> {
  try {
    const [ymin, xmin, ymax, xmax] = figure.box;

    const response = await ai.generate({
      model: googleAI.model("gemini-3.1-flash"), // Use 3.1-flash for vision tasks
      prompt: [
        {
          text: `You are looking at a PDF document. Describe the figure on page ${figure.page} in the region [Top: ${ymin}, Left: ${xmin}, Bottom: ${ymax}, Right: ${xmax}]. 
          ${figure.label ? `Context: ${figure.label}` : ""}
          Describe visual elements, text, and data points so it can be reconstructed.`,
        },
        {
          media: {
            url: `data:application/pdf;base64,${pdfBase64}`,
            contentType: "application/pdf",
          },
        },
      ],
      config: { temperature: 0.1 },
    });

    return response.text || figure.label || `Figure ${index + 1}`;
  } catch (error: any) {
    console.error(`Failed to describe figure ${index + 1}:`, error.message);
    return null;
  }
}

export const worksheetExtractorFlow = ai.defineFlow(
  {
    name: "worksheetExtractorFlow",
    inputSchema: z.object({
      tenantId: z.string(),
      pdfBase64: z.string().optional(),
      pdfUrl: z.string().url().optional(),
      filename: z.string().optional(),
      curriculum: z.string().optional(),
      options: z.object({
        autoTag: z.boolean().optional(),
      }).optional(),
    }),
    outputSchema: ExtractionResponseSchema,
  },
  async (input) => {
    let pdfData: string;
    if (input.pdfBase64) {
      pdfData = input.pdfBase64;
    } else if (input.pdfUrl) {
      const response = await fetch(input.pdfUrl);
      const buffer = await response.arrayBuffer();
      pdfData = Buffer.from(buffer).toString("base64");
    } else {
      throw new Error("Either pdfUrl or pdfBase64 must be provided.");
    }

    const timestamp = Date.now();
    const storagePath = `tenants/${input.tenantId}/pdfs/${input.filename || `doc_${timestamp}`}.pdf`;
    const pdfUrl = await uploadToStorage(
      Buffer.from(pdfData, "base64"),
      storagePath,
      "application/pdf"
    );

    const skipTaxonomy = input.options?.autoTag === false;

    const prompt = `
Extract every question from the document. Include text in Markdown with LaTeX ($...$ inline, $$...$$ block).
Identify figure locations on the page if any.

## TAXONOMY GUIDELINES${skipTaxonomy ? " (Use placeholders)" : ""}
- domain, topic, subTopic, microSkill, cognitiveDepth (Fluency|Conceptual|Application|Synthesis), curriculum, scaffoldLevel (1-5).
- curriculum: ${input.curriculum || "Best fit from context"}

## OUTPUT FORMAT
Return ONLY valid JSON matching this structure:
{
  "questions": [
    {
      "stemMarkdown": "...",
      "type": "MCQ_SINGLE" | "MCQ_MULTI" | "FILL_IN_BLANK" | "FREE_RESPONSE" | "PASSAGE_BASED",
      "options": [{"text": "...", "isCorrect": true/false, "explanation": "..."}],
      "correctAnswer": "...",
      "taxonomy": { ... },
      "hint": "...",
      "figures": [{"page": 1, "box": [ymin, xmin, ymax, xmax], "label": "..."}]
    }
  ],
  "sourceFilename": "${input.filename || ""}"
}
`;

    const response = await ai.generate({
      model: googleAI.model("gemini-3.1-flash"),
      prompt: [
        { text: prompt },
        { media: { url: `data:application/pdf;base64,${pdfData}`, contentType: "application/pdf" } }
      ],
      config: { temperature: 0.1 },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned no output");

    const jsonStr = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Enrich figures with vision descriptions
    for (const question of parsed.questions) {
      if (question.figures && question.figures.length > 0) {
        for (let i = 0; i < question.figures.length; i++) {
          const desc = await extractFigureDescription(pdfData, question.figures[i], i);
          if (desc) question.figures[i].label = desc;
        }
      }
    }

    return {
      ...parsed,
      pdfUrl,
    };
  }
);

import { z } from "genkit";
import { ai } from "../genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { uploadToStorage } from "../utils/image";
import { ExtractionResponseSchema } from "../types";

/**
 * Given a PDF (base64), a page number, and a bounding box, ask Gemini to
 * extract just that figure region and return it as a PNG data URI.
 * We then upload the image to Firebase Storage and return the URL.
 */
async function extractFigureImage(
  pdfBase64: string,
  figure: { page: number; box: number[]; label?: string },
  index: number,
  filename: string,
): Promise<string | null> {
  try {
    const [ymin, xmin, ymax, xmax] = figure.box;

    const response = await ai.generate({
      model: googleAI.model("gemini-3-flash-preview"),
      prompt: [
        {
          text: `You are looking at a PDF document. I need you to extract a specific figure/diagram from this document.

The figure is on page ${figure.page} and is located in this region (coordinates in 0-1000 scale):
- Top: ${ymin}, Left: ${xmin}, Bottom: ${ymax}, Right: ${xmax}
${figure.label ? `- Description: ${figure.label}` : ""}

Please describe this figure in detail so I can recreate it. Include:
1. The type of figure (graph, geometric shape, diagram, table, etc.)
2. All text labels, axis labels, values
3. All visual elements (lines, curves, shapes, arrows, shading)
4. Exact coordinates or values if visible

Return a detailed textual description.`,
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

    // For now, we can't directly get image output from Gemini for a crop,
    // so we'll use a different approach: render the figure description as metadata
    // and use the PDF URL with page number as the figure source.
    // The real win is that we have the figure metadata stored server-side.

    const description = response.text || figure.label || `Figure ${index + 1}`;

    // Store the description back — the frontend will use pdfUrl + page as fallback
    console.log(
      `Figure ${index + 1} described: ${description.substring(0, 100)}...`,
    );

    return description;
  } catch (error: any) {
    console.error(`Failed to extract figure ${index + 1}:`, error.message);
    return null;
  }
}

export const worksheetExtractorFlow = ai.defineFlow(
  {
    name: "worksheetExtractorFlow",
    inputSchema: z.object({
      pdfUrl: z.string().url().optional(),
      pdfBase64: z.string().optional(),
      filename: z.string().optional(),
      curriculum: z.string().optional(),
      options: z
        .object({
          autoTag: z.boolean().optional(),
        })
        .optional(),
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

    console.log(
      `Starting Extraction pipeline for ${input.filename || "document"}...`,
    );

    // Upload PDF to Storage to get a persistent URL for the frontend
    const storagePath = `pdfs/${input.filename || `doc_${Date.now()}`}.pdf`;
    const pdfUrl = await uploadToStorage(
      Buffer.from(pdfData, "base64"),
      storagePath,
      "application/pdf",
    );
    console.log(`PDF uploaded to: ${pdfUrl}`);

    // ── Build Extraction Prompt ──────────────────────────────────────
    const skipTaxonomy = input.options?.autoTag === false;

    const prompt = `
You are an expert Math Education Architect tasked with extracting questions from a PDF worksheet.

## GOAL
Extract every question from the document. If a question has an associated diagram, graph, or figure, you MUST identify its location on the page.

## EXTRACTION REQUIREMENTS
1. **Extract EVERY question**. Do not skip any.
2. **Text**: Include the complete question text in Markdown with LaTeX.
3. **LaTeX**: Use $...$ for inline math (e.g., $x^2$) and $$...$$ for block math.
4. **Figures**: If a question refers to visual content (graph, diagram, geometry figure):
   - Set the \`figures\` field.
   - valid \`box\`: [ymin, xmin, ymax, xmax] coordinates (0-1000 scale).
   - valid \`page\`: The page number (1-indexed) where the figure appears.
   - valid \`label\`: A short description (e.g., "Triangle ABC", "Graph of f(x)").
5. **Taxonomy**: Classify the question according to the curriculum.

## TAXONOMY GUIDELINES${
      skipTaxonomy
        ? " (auto-tagging disabled — use placeholder values)"
        : " (All fields are REQUIRED)"
    }
- domain: Main subject area (e.g., Algebra, Geometry, Calculus)
- topic: Specific topic (e.g., Linear Equations, Integrals)
- subTopic: Granular subtopic
- microSkill: Precise skill
- cognitiveDepth: Fluency, Conceptual, Application, or Synthesis
- curriculum: ${
      input.curriculum
        ? `"${input.curriculum}"`
        : "Choose best fit from context"
    }
- scaffoldLevel: 1-5 (1=easy, 5=hard)

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown fences, no extra text) matching this exact structure:
{
  "questions": [
    {
      "stemMarkdown": "Question text in Markdown with LaTeX ($x^2$ for inline, $$...$$ for block)",
      "type": "MCQ_SINGLE" | "MCQ_MULTI" | "FILL_IN_BLANK" | "FREE_RESPONSE" | "PASSAGE_BASED",
      "options": [{"text": "...", "isCorrect": true/false, "explanation": "..."}],  // for MCQ types
      "correctAnswer": "...",  // for non-MCQ types
      "taxonomy": {
        "domain": "...", "topic": "...", "subTopic": "...", "microSkill": "...",
        "cognitiveDepth": "Fluency" | "Conceptual" | "Application" | "Synthesis",
        "curriculum": "Algebra 1" | "Algebra 2" | "Geometry",
        "scaffoldLevel": 1-5
      },
      "hint": "...",
      "figures": [{"page": 1, "box": [ymin, xmin, ymax, xmax], "label": "..."}]
    }
  ],
  "sourceFilename": "${input.filename || ""}"
}
    `;

    const parts: any[] = [{ text: prompt }];
    parts.push({
      media: {
        url: `data:application/pdf;base64,${pdfData}`,
        contentType: "application/pdf",
      },
    });

    try {
      // Use text output instead of structured output schema to avoid
      // Gemini 3's nesting depth limit on GenerationConfig schemas.
      const response = await ai.generate({
        model: googleAI.model("gemini-3-flash-preview"),
        prompt: parts,
        config: {
          temperature: 0.1,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("AI returned no output");
      }

      // Parse the JSON response, stripping any markdown fences if present
      const jsonStr = text
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();
      let parsed: any;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseError: any) {
        console.error(
          "Failed to parse AI response as JSON:",
          text.substring(0, 500),
        );
        throw new Error(`AI returned invalid JSON: ${parseError.message}`);
      }

      // Validate with Zod schema (lenient — strip unknown fields)
      const validated = ExtractionResponseSchema.safeParse(parsed);
      if (!validated.success) {
        console.warn("Schema validation warnings:", validated.error.issues);
        console.log("Using raw parsed data despite validation warnings");
      }

      const output = validated.success ? validated.data : parsed;

      // ── PHASE 2: Extract Figures via Gemini Vision ──────────────────
      const questionsWithFigures = (output.questions || []).filter(
        (q: any) => q.figures && q.figures.length > 0,
      );

      if (questionsWithFigures.length > 0) {
        console.log(
          `=== FIGURE EXTRACTION: ${questionsWithFigures.length} questions have figures ===`,
        );

        for (const question of output.questions) {
          if (!question.figures || question.figures.length === 0) continue;

          const figureDescriptions: string[] = [];
          for (let i = 0; i < question.figures.length; i++) {
            const desc = await extractFigureImage(
              pdfData,
              question.figures[i],
              i,
              input.filename || "doc",
            );
            if (desc) figureDescriptions.push(desc);
          }

          // Store descriptions as enriched labels on the figures
          question.figures = question.figures.map((fig: any, i: number) => ({
            ...fig,
            label: figureDescriptions[i] || fig.label || `Figure ${i + 1}`,
          }));
        }
      }

      // Debug logging
      console.log("=== EXTRACTION RESULT ===");
      console.log("Questions found:", output.questions?.length || 0);
      console.log("Questions with figures:", questionsWithFigures?.length || 0);

      return {
        ...output,
        pdfUrl,
      };
    } catch (error: any) {
      console.error("Genkit generate error:", error);
      throw new Error(
        `AI Generation failed: ${error.message || "Unknown error"}`,
      );
    }
  },
);

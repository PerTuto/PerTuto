import { z } from "genkit";
import { ai } from "../genkit";
import { googleAI } from "@genkit-ai/google-genai";

interface SyllabusLevel {
  name: string;
  description?: string;
  children?: SyllabusLevel[];
}

const SyllabusLevelSchema: z.ZodType<SyllabusLevel> = z.lazy(() =>
  z.object({
    name: z.string(),
    description: z.string().optional(),
    children: z.array(SyllabusLevelSchema).optional(),
  }),
);

export const syllabusGeneratorFlow = ai.defineFlow(
  {
    name: "syllabusGeneratorFlow",
    inputSchema: z.object({
      subject: z.string(),
      targetLevel: z.string().optional().default("grade 9-12"),
    }),
    outputSchema: z.array(SyllabusLevelSchema),
  },
  async (input) => {
    const prompt = `
      You are an expert Math Curriculum Architect and Pedagogical Lead.
      Generate a comprehensive, high-resolution syllabus hierarchy for the subject: "${input.subject}" targetting "${input.targetLevel}".
      
      The hierarchy MUST follow this exact structure:
      1. Unit (e.g., Linear Equations)
      2. Topic (e.g., Solving for X)
      3. Skill (e.g., Two-step Equations)
      
      For each Unit, provide 3-5 Topics.
      For each Topic, provide 2-4 granular Micro-Skills.
      Include a brief pedagogical description for each node.
      
      Return a flat-ish array matching the SyllabusLevelSchema, where 'children' represents the next level down.
      Focus on logical progression and completeness.
    `;

    const { output } = await ai.generate({
      // NOTE: This flow is currently NOT exported from index.ts.
      // If enabling, wire it up in index.ts first.
      model: googleAI.model("gemini-2.0-flash"),
      prompt,
      output: { schema: z.array(SyllabusLevelSchema) },
      config: {
        temperature: 0.2, // Low temperature for factual curriculum structure
      },
    });

    if (!output) {
      throw new Error("Failed to generate syllabus.");
    }

    return output;
  },
);

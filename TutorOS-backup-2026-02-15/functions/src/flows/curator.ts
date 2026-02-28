import { z } from "genkit";
import { ai } from "../genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { CognitiveDepthSchema, CurriculumSchema } from "../types";

const QuizCuratorInputSchema = z.object({
  query: z
    .string()
    .describe(
      "Natural language request for a quiz (e.g., '10 hard SAT algebra questions')",
    ),
});

const QuizCuratorOutputSchema = z.object({
  filters: z.object({
    curriculum: CurriculumSchema.optional(),
    domain: z.string().optional(),
    topic: z.string().optional(),
    cognitiveDepth: CognitiveDepthSchema.optional(),
    scaffoldLevelMin: z.number().optional(),
    scaffoldLevelMax: z.number().optional(),
  }),
  count: z.number().describe("Number of questions requested"),
  justification: z
    .string()
    .describe("Explanation of why these filters were chosen"),
});

export const quizCuratorFlow = ai.defineFlow(
  {
    name: "quizCuratorFlow",
    inputSchema: QuizCuratorInputSchema,
    outputSchema: QuizCuratorOutputSchema,
  },
  async (input) => {
    const prompt = `
      You are an expert Math Education Architect assistant.
      The user wants to curate a math quiz from a large databank.
      Interpret their natural language request and convert it into structured search filters.
      
      User Request: "${input.query}"
      
      Available Curricula: Algebra 1, Algebra 2, Geometry.
      Cognitive Depth Levels: Fluency, Conceptual, Application, Synthesis.
      Scaffold Levels: 1 to 5.
      
      Note: If the user mentions "hard", mapped to higher Cognitive Depth (Application/Synthesis) and Scaffold Level (4-5).
      If they mention "easy", map to Fluency/Conceptual and Scaffold Level (1-2).
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-3-flash-preview"),
      prompt: prompt,
      output: { schema: QuizCuratorOutputSchema },
      config: {
        temperature: 0.2,
      },
    });

    if (!output) {
      throw new Error("Failed to interpret quiz curation request.");
    }

    return output;
  },
);


import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { CognitiveDepthSchema, CurriculumSchema } from "../schemas/question-schemas";

const QuizCuratorInputSchema = z.object({
  query: z.string().describe("Natural language request for a quiz (e.g., '10 hard SAT algebra questions')"),
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
  justification: z.string().describe("Explanation of why these filters were chosen"),
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
      Interpret the user's natural language request into structured search filters for a math question bank.
      
      User Request: "${input.query}"
      
      Available Curricula: Algebra 1, Algebra 2, Geometry, SAT, IB Math.
      Cognitive Depth Levels: Fluency, Conceptual, Application, Synthesis.
      Scaffold Levels: 1 to 5.
      
      Map "hard" to Application/Synthesis and level 4-5.
      Map "easy" to Fluency/Conceptual and level 1-2.
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-3.1-flash"),
      prompt: prompt,
      output: { schema: QuizCuratorOutputSchema },
      config: { temperature: 0.2 },
    });

    if (!output) throw new Error("Failed to interpret quiz curation request.");
    return output;
  }
);

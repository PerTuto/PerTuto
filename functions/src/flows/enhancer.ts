
import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";

const QuestionInputSchema = z.object({
  stem: z.string(),
  type: z.string(),
  domain: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  options: z.array(z.object({
    text: z.string(),
    isCorrect: z.boolean(),
    explanation: z.string().optional().nullable(),
  })).optional().nullable(),
  correctAnswer: z.string().optional().nullable(),
});

const EnhancementRequestSchema = z.object({
  operation: z.enum([
    "rephrase",
    "adjust_difficulty",
    "generate_explanation",
    "generate_similar",
  ]),
  question: QuestionInputSchema,
  direction: z.enum(["easier", "harder"]).optional(),
  count: z.number().min(1).max(5).default(3).optional(),
});

const RephraseResultSchema = z.object({
  alternatives: z.array(z.object({
    text: z.string(),
    rationale: z.string().optional(),
  })),
});

const AdjustDifficultyResultSchema = z.object({
  adjustedQuestion: z.string(),
  newDifficulty: z.string(),
  changes: z.string(),
});

const ExplanationStepSchema = z.object({
  step: z.number(),
  description: z.string(),
  equation: z.string().optional(),
});

const ExplanationResultSchema = z.object({
  steps: z.array(ExplanationStepSchema),
  finalAnswer: z.string(),
});

const SimilarQuestionSchema = z.object({
  stem: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});

const GenerateSimilarResultSchema = z.object({
  questions: z.array(SimilarQuestionSchema),
});

const EnhancerOutputSchema = z.union([
  RephraseResultSchema,
  AdjustDifficultyResultSchema,
  ExplanationResultSchema,
  GenerateSimilarResultSchema,
]);

export const questionEnhancerFlow = ai.defineFlow(
  {
    name: "questionEnhancerFlow",
    inputSchema: EnhancementRequestSchema,
    outputSchema: EnhancerOutputSchema,
  },
  async (input) => {
    const { operation, question, direction, count } = input;

    let prompt = "";
    let outputSchema: any;

    switch (operation) {
      case "rephrase":
        prompt = `Rephrase this math question in ${count} ways: ${question.stem}`;
        outputSchema = RephraseResultSchema;
        break;
      case "adjust_difficulty":
        prompt = `Make this question ${direction}: ${question.stem}`;
        outputSchema = AdjustDifficultyResultSchema;
        break;
      case "generate_explanation":
        prompt = `Provide a step-by-step explanation for: ${question.stem}`;
        outputSchema = ExplanationResultSchema;
        break;
      case "generate_similar":
        prompt = `Generate ${count} similar questions to: ${question.stem}`;
        outputSchema = GenerateSimilarResultSchema;
        break;
    }

    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.0-flash"),
      prompt,
      output: { schema: outputSchema },
      config: { temperature: 0.5 },
    });

    if (!output) throw new Error("Enhancement failed.");
    return output;
  }
);

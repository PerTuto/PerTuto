import { z } from "genkit";
import { ai } from "../genkit";
import { googleAI } from "@genkit-ai/google-genai";

const QuestionInputSchema = z.object({
  stem: z.string(),
  type: z.string(),
  domain: z.string(),
  topic: z.string(),
  difficulty: z.string(),
  options: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
        explanation: z.string().optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
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
  alternatives: z.array(
    z.object({
      text: z.string(),
      rationale: z.string().optional(),
    }),
  ),
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

    switch (operation) {
      case "rephrase":
        return await rephraseQuestion(question, count || 3);

      case "adjust_difficulty":
        if (!direction) {
          throw new Error("Direction required for difficulty adjustment");
        }
        return await adjustDifficulty(question, direction);

      case "generate_explanation":
        return await generateExplanation(question);

      case "generate_similar":
        return await generateSimilar(question, count || 3);

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  },
);

async function rephraseQuestion(
  question: z.infer<typeof QuestionInputSchema>,
  count: number,
) {
  const prompt = `You are an expert mathematics educator. Rephrase the following question in ${count} different ways while preserving the exact same mathematical meaning and difficulty.

ORIGINAL QUESTION:
${question.stem}

REQUIREMENTS:
- Maintain the same mathematical concept and difficulty
- Keep LaTeX notation ($ symbols) where present
- Make each version distinct in wording but identical in meaning
- Each version should be clear and grammatically correct

Provide ${count} alternative phrasings with a brief rationale for each.`;

  const response = await ai.generate({
    model: googleAI.model("gemini-3-flash-preview"),
    prompt,
    output: { schema: RephraseResultSchema },
    config: {
      temperature: 0.7,
    },
  });

  return response.output!;
}

async function adjustDifficulty(
  question: z.infer<typeof QuestionInputSchema>,
  direction: "easier" | "harder",
) {
  const prompt = `You are an expert mathematics educator. Adjust the difficulty of this question to make it ${direction}.

ORIGINAL QUESTION:
${question.stem}
Current Difficulty: ${question.difficulty}
Domain: ${question.domain}
Topic: ${question.topic}

REQUIREMENTS FOR ${direction.toUpperCase()}:
${
  direction === "easier"
    ? `- Simplify numbers/variables
- Reduce number of steps
- Make the concept more concrete
- Use simpler vocabulary
- New difficulty should be one level easier`
    : `- Use more complex numbers/variables
- Require additional steps or concepts
- Make the problem more abstract
- Introduce multi-step reasoning
- New difficulty should be one level harder`
}

Provide the adjusted question text, the new difficulty level (Fluency/Conceptual/Application/Synthesis), and explain what changed.`;

  const response = await ai.generate({
    model: googleAI.model("gemini-3-flash-preview"),
    prompt,
    output: { schema: AdjustDifficultyResultSchema },
    config: {
      temperature: 0.5,
    },
  });

  return response.output!;
}

async function generateExplanation(
  question: z.infer<typeof QuestionInputSchema>,
) {
  const prompt = `You are an expert mathematics educator. Provide a detailed step-by-step explanation for solving this question.

QUESTION:
${question.stem}
${question.options ? `Options: ${question.options.join(", ")}` : ""}
${question.correctAnswer ? `Correct Answer: ${question.correctAnswer}` : ""}

REQUIREMENTS:
- Break down the solution into clear, numbered steps
- Use LaTeX notation for mathematical expressions (e.g., $x^2$, $\\frac{a}{b}$)
- Explain the reasoning for each step
- Show intermediate calculations
- State the final answer clearly

Provide the explanation as a series of steps with optional equations in LaTeX.`;

  const response = await ai.generate({
    model: googleAI.model("gemini-3-flash-preview"),
    prompt,
    output: { schema: ExplanationResultSchema },
    config: {
      temperature: 0.3,
    },
  });

  return response.output!;
}

async function generateSimilar(
  question: z.infer<typeof QuestionInputSchema>,
  count: number,
) {
  const prompt = `You are an expert mathematics educator. Generate ${count} similar practice questions based on this example.

ORIGINAL QUESTION:
${question.stem}
Type: ${question.type}
Domain: ${question.domain}
Topic: ${question.topic}

REQUIREMENTS:
- Same mathematical concept and difficulty
- Different numbers/variables/context
- ${question.type === "MCQ_SINGLE" ? "Include 4 multiple choice options with one correct answer" : ""}
- Use LaTeX notation where appropriate
- Each question should test the same skill in a slightly different way

Generate ${count} distinct but similar questions.`;

  const response = await ai.generate({
    model: googleAI.model("gemini-3-flash-preview"),
    prompt,
    output: { schema: GenerateSimilarResultSchema },
    config: {
      temperature: 0.8,
    },
  });

  return response.output!;
}

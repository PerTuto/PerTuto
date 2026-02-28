import { z } from "genkit";
import { ai } from "../genkit";
import { googleAI } from "@genkit-ai/google-genai";

const ValidationIssueSchema = z.object({
  type: z.enum(["error", "warning", "suggestion"]),
  field: z.string(),
  message: z.string(),
  suggestion: z.string().optional(),
});

const SuggestedTaxonomySchema = z.object({
  domain: z.string(),
  topics: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  relatedConcepts: z.array(z.string()).optional(),
});

const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(ValidationIssueSchema),
  suggestedTaxonomy: SuggestedTaxonomySchema.optional(),
  complexityScore: z.number().min(1).max(10).optional(),
});

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

export const questionValidatorFlow = ai.defineFlow(
  {
    name: "questionValidatorFlow",
    inputSchema: QuestionInputSchema,
    outputSchema: ValidationResultSchema,
  },
  async (input) => {
    const prompt = `You are an expert mathematics educator and question quality validator. Analyze the following question and provide detailed validation feedback.

QUESTION DETAILS:
Question: ${input.stem}
Type: ${input.type}
Domain: ${input.domain}
Topic: ${input.topic}
Difficulty: ${input.difficulty}
${input.options ? `Options: ${input.options.join(", ")}` : ""}
${input.correctAnswer ? `Correct Answer: ${input.correctAnswer}` : ""}

VALIDATION TASKS:
1. Check if the question is clear and well-formed
2. Verify answer correctness (does answer exist in options for MCQ?)
3. Check if difficulty level matches question complexity
4. Validate LaTeX syntax if present (look for $ symbols)
5. Assess if domain and topic are appropriate

TAXONOMY SUGGESTIONS:
- Suggest the most appropriate domain (Algebra, Geometry, Calculus, Statistics, Number Theory, Trigonometry)
- Suggest 2-3 specific topics that apply
- Identify 1-2 prerequisite skills needed
- List 1-2 related mathematical concepts

COMPLEXITY SCORING:
Rate the question complexity from 1-10 where:
- 1-3: Basic recall, single-step
- 4-6: Multi-step, requires understanding
- 7-8: Complex application, synthesis
- 9-10: Advanced problem-solving

Provide your analysis in the exact JSON format specified.`;

    const response = await ai.generate({
      model: googleAI.model("gemini-3-flash-preview"),
      prompt,
      output: { schema: ValidationResultSchema },
      config: {
        temperature: 0.3,
      },
    });

    return response.output!;
  },
);

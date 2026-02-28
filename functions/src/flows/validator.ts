
import { z } from "genkit";
import { ai } from "../config/genkit";
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

export const questionValidatorFlow = ai.defineFlow(
  {
    name: "questionValidatorFlow",
    inputSchema: QuestionInputSchema,
    outputSchema: ValidationResultSchema,
  },
  async (input) => {
    const prompt = `Analyze this math question for quality and accuracy.
    
Question: ${input.stem}
Type: ${input.type}
Options: ${JSON.stringify(input.options)}
Answer: ${input.correctAnswer}

1. Check for clarity and correctness.
2. Validate LaTeX syntax.
3. Suggest appropriate taxonomy and prerequisite skills.
4. Rate complexity (1-10).
`;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.0-flash"),
      prompt,
      output: { schema: ValidationResultSchema },
      config: { temperature: 0.1 },
    });

    if (!output) throw new Error("Validation failed.");
    return output;
  }
);

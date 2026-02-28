import { z } from "zod";
import { ai } from "../config/genkit";

export const assignmentFeedbackFlow = ai.defineFlow(
  {
    name: "assignmentFeedbackFlow",
    inputSchema: z.object({
      assignmentTitle: z.string(),
      studentSubmission: z.string(),
      rubric: z.string().optional(),
    }),
    outputSchema: z.object({
      overallFeedback: z.string(),
      strengths: z.array(z.string()),
      areasForImprovement: z.array(z.string()),
      lineByLineComments: z.array(z.object({
        lineNumber: z.number().optional(),
        quote: z.string(),
        comment: z.string(),
        sentiment: z.enum(["positive", "constructive", "neutral"]),
      })),
      suggestedNextSteps: z.array(z.string()),
    }),
  },
  async (input) => {
    const prompt = `
      You are an expert tutor. Provide detailed, encouraging, and constructive feedback on the following student submission.
      
      Assignment: ${input.assignmentTitle}
      Submission: ${input.studentSubmission}
      ${input.rubric ? `Rubric: ${input.rubric}` : ""}
      
      Focus on being specific. For the line-by-line comments, extract exact quotes and explain how to improve or why it was good.
      Maintain a supportive, gamified tone (like a coach).
    `;

    const { output } = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
      output: { format: "json" },
    });

    if (!output) throw new Error("AI failed to generate feedback");
    return output as any;
  }
);

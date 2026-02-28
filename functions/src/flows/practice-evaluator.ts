
import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const practiceEvaluatorFlow = ai.defineFlow(
  {
    name: "practiceEvaluatorFlow",
    inputSchema: z.object({
      question: z.string(),
      correctAnswer: z.string(),
      studentAnswer: z.string(),
      options: z.array(z.string()).optional(),
    }),
    outputSchema: z.object({
      isCorrect: z.boolean(),
      explanation: z.string(),
      score: z.number().min(0).max(1),
      feedback: z.string(),
    }),
  },
  async (input) => {
    const { question, correctAnswer, studentAnswer, options } = input;

    const prompt = `
      You are a helpful academic tutor. Evaluate a student's answer for accuracy.
      
      Question: ${question}
      ${options ? `Options: ${options.join(", ")}` : ""}
      Reference Correct Answer: ${correctAnswer}
      Student Answer: ${studentAnswer}
      
      Tasks:
      1. Determine if the student's answer is semantically equivalent to the correct answer.
      2. Be lenient with minor spelling or formatting errors unless they change the meaning.
      3. For multiple choice, check if they picked the right index or text.
      4. Provide a very brief, encouraging explanation (max 2 sentences).
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.0-flash"),
      prompt,
      output: { format: "json" },
      config: { temperature: 0.1 },
    });

    if (!output) throw new Error("Evaluation failed.");
    return output as any;
  }
);

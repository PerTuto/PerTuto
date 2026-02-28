import { ai } from "../config/genkit";
import { z } from "zod";
import { googleAI } from "@genkit-ai/google-genai";

export const scorePredictorFlow = ai.defineFlow(
  {
    name: "scorePredictorFlow",
    inputSchema: z.object({
      studentId: z.string(),
      historicalScores: z.array(z.object({
        date: z.string(),
        score: z.number(),
        maxScore: z.number(),
      })),
      targetExamDate: z.string().optional(),
    }),
    outputSchema: z.object({
      predictedScore: z.number(),
      confidence: z.number(),
      justification: z.string(),
      improvementRequired: z.number(),
    }),
  },
  async (input: any) => {
    const prompt = `
      Predict the student's final exam performance based on their historical data.
      Student ID: ${input.studentId}
      Trends: ${JSON.stringify(input.historicalScores, null, 2)}
      
      Output a structured prediction including:
      1. Predicted score (percentage).
      2. Confidence level (0-1).
      3. A justification based on the trend (improving, stagnant, or declining).
      4. Percentage of improvement needed to reach a 'A' grade (90%).
    `;

    const response = await ai.generate({
      model: googleAI.model("gemini-1.5-flash"),
      prompt: [
        { text: prompt }
      ],
      config: { temperature: 0.2 },
    });

    console.log("Prediction raw response:", response.text);

    // Mock response for demo
    return {
      predictedScore: 84,
      confidence: 0.85,
      justification: "Student shows a strong upward trend in Mathematics (+12% per month) but a plateau in Science. Overall readiness is high but inconsistent across domains.",
      improvementRequired: 6,
    };
  }
);

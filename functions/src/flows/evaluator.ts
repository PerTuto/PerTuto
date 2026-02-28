
import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";

const EvaluationOutputSchema = z.object({
  questionScores: z.array(z.object({
    questionId: z.string(),
    marksAwarded: z.number(),
    maxMarks: z.number(),
    feedback: z.string(),
    confidence: z.number(), // 0-100
  })),
  totalScore: z.number(),
  maxScore: z.number(),
  confidenceScore: z.number(), // Overall 0-100
  requiresReview: z.boolean(),
});

export const answerSheetEvaluatorFlow = ai.defineFlow(
  {
    name: "answerSheetEvaluatorFlow",
    inputSchema: z.object({
      tenantId: z.string(),
      testId: z.string(),
      studentId: z.string(),
      answerSheetUrl: z.string(),
      questionPaper: z.any(), // Full paper with questions
    }),
    outputSchema: EvaluationOutputSchema,
  },
  async (input) => {
    const { questionPaper, answerSheetUrl } = input;

    // Construct a prompt that describes each question and its rubric
    const rubrics = questionPaper.sections.flatMap((s: any) => 
      s.questions.map((q: any) => ({
        id: q.questionId,
        stem: q.stem || "Question link broken",
        maxMarks: q.marks,
        correctAnswer: q.correctAnswer || "Check options/rubric",
        type: q.type
      }))
    );

    const prompt = `
You are an expert academic evaluator. You are provided with a scanned student answer sheet and the original question paper rubrics.

## TASK
1. Analyze the handwritten student answers for each question.
2. Grade them accurately based on the provided rubrics.
3. For subjective questions (FREE_RESPONSE), provide constructive feedback.
4. If a student has skipped a question, award 0 marks.
5. Provide a confidence score for each evaluation (e.g., lower confidence if handwriting is illegible).

## QUESTION RUBRICS
${JSON.stringify(rubrics, null, 2)}

## OUTPUT FORMAT
Return ONLY valid JSON:
{
  "questionScores": [
    {
      "questionId": "...",
      "marksAwarded": 2.5,
      "maxMarks": 5,
      "feedback": "...",
      "confidence": 95
    }
  ],
  "totalScore": 15,
  "maxScore": 25,
  "confidenceScore": 92,
  "requiresReview": false
}

Note: Set "requiresReview" to true if the overall "confidenceScore" is less than 85.
`;

    const response = await ai.generate({
      model: googleAI.model("gemini-3.1-pro"),
      prompt: [
        { text: prompt },
        { media: { url: answerSheetUrl, contentType: "application/pdf" } } // Gemini 3.1 handles PDF Vision
      ],
      config: { temperature: 0.1 },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned no evaluation output");

    const jsonStr = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    try {
        const parsed = JSON.parse(jsonStr);
        return {
            ...parsed,
            requiresReview: parsed.confidenceScore < 85
        };
    } catch (e) {
        console.error("Failed to parse AI evaluation JSON:", text);
        throw new Error("AI output was not valid JSON");
    }
  }
);

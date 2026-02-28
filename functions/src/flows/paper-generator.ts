
import { z } from "genkit";
import { ai } from "../config/genkit";
import { googleAI } from "@genkit-ai/google-genai";

const PaperSectionSchema = z.object({
  title: z.string(),
  instructions: z.string().optional(),
  questionIds: z.array(z.string()),
  totalMarks: z.number(),
});

const PaperSchema = z.object({
  title: z.string(),
  courseId: z.string(),
  subjectId: z.string(),
  sections: z.array(PaperSectionSchema),
  totalMarks: z.number(),
  duration: z.number().describe("Duration in minutes"),
  instructions: z.string().optional(),
});

export const paperGeneratorFlow = ai.defineFlow(
  {
    name: "paperGeneratorFlow",
    inputSchema: z.object({
      tenantId: z.string(),
      courseId: z.string(),
      subjectId: z.string(),
      title: z.string(),
      chapters: z.array(z.object({
        id: z.string(),
        name: z.string(),
        weightage: z.number(), // Percentage 0-100
      })),
      constraints: z.array(z.object({
        type: z.string(), // MCQ_SINGLE, FREE_RESPONSE etc
        count: z.number(),
        marksEach: z.number(),
      })),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]),
      totalDuration: z.number(),
      availableQuestions: z.array(z.any()), // List of question objects from bank
    }),
    outputSchema: z.object({
      paper: PaperSchema,
      metadata: z.object({
        chapterDistribution: z.record(z.number()),
        difficultyDistribution: z.record(z.number()),
      }),
    }),
  },
  async (input) => {
    const { availableQuestions, chapters, constraints, difficulty, totalDuration, title } = input;

    const prompt = `
      You are an expert Exam Controller. Generate a balanced Question Paper structure using the available questions provided.
      
      Paper Title: ${title}
      Difficulty Target: ${difficulty}
      Total Duration: ${totalDuration} minutes
      
      ## Constraints:
      ${constraints.map(c => `- ${c.count} questions of type ${c.type} (${c.marksEach} marks each)`).join("\n")}
      
      ## Chapter Weightage:
      ${chapters.map(ch => `- ${ch.name}: ${ch.weightage}%`).join("\n")}
      
      ## Available Questions (JSON):
      ${JSON.stringify(availableQuestions.map(q => ({
        id: q.id,
        type: q.type,
        difficulty: q.difficulty,
        topicId: q.taxonomy.topicId,
        stemSnippet: q.stem.substring(0, 100)
      })))}
      
      Select the best questions to match the difficulty and chapter weightage as closely as possible.
      Organize the paper into logical sections (e.g., Section A: MCQ, Section B: Subjective).
      Return ONLY valid JSON matching the OutputSchema.
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-3.1-pro"),
      prompt: prompt,
      output: { 
        schema: z.object({ 
          paper: PaperSchema,
          metadata: z.object({
             chapterDistribution: z.record(z.number()),
             difficultyDistribution: z.record(z.number()),
          })
        }) 
      },
      config: { temperature: 0.1 },
    });

    if (!output) throw new Error("AI failed to generate paper structure.");

    return output;
  }
);

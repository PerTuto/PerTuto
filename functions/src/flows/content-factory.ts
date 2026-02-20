import { z } from 'zod';
import { ai } from '../config/genkit';

const QuestionSchema = z.object({
    stem: z.string().describe("The main question text"),
    options: z.array(z.string()).optional().describe("Multiple choice options if applicable"),
    answer: z.string().describe("The correct answer"),
    explanation: z.string().describe("Step-by-step explanation"),
    difficulty: z.enum(['1', '2', '3']).describe("Difficulty level: 1=Easy, 2=Medium, 3=Hard")
});

const GenerateQuestionsInput = z.object({
    topic: z.string(),
    curriculum: z.string(),
    count: z.number().default(5)
});

const GenerateNotesInput = z.object({
    topic: z.string(),
    curriculum: z.string()
});

type QuestionsInput = z.infer<typeof GenerateQuestionsInput>;
type NotesInput = z.infer<typeof GenerateNotesInput>;

export const generateQuestionsFlow = ai.defineFlow(
    {
        name: 'generateQuestions',
        inputSchema: GenerateQuestionsInput,
        outputSchema: z.object({
            questions: z.array(QuestionSchema)
        }),
    },
    async (input: QuestionsInput) => {
        const { topic, curriculum, count } = input;

        const prompt = `
            Generate ${count} robust practice questions for:
            Curriculum: ${curriculum}
            Topic: ${topic}
            
            Ensure questions are academically rigorous and match the style of ${curriculum} exams.
            Include a mix of difficulties.
            For Math/Physics, use LaTeX for mathematical expressions (e.g., $x^2$).
        `;

        const { output } = await ai.generate({
            prompt: prompt,
            output: { schema: z.object({ questions: z.array(QuestionSchema) }) }
        });

        if (!output) {
            throw new Error("Failed to generate questions");
        }

        return output;
    }
);

export const generateNotesFlow = ai.defineFlow(
    {
        name: 'generateNotes',
        inputSchema: GenerateNotesInput,
        outputSchema: z.object({
            markdown: z.string()
        }),
    },
    async (input: NotesInput) => {
        const { topic, curriculum } = input;

        const prompt = `
            Create a comprehensive high-yield revision note (Cheatsheet style) for:
            Curriculum: ${curriculum}
            Topic: ${topic}
            
            Use Markdown formatting.
            Include:
            - Key Definitions
            - Important Formulae (use LaTeX $$ for blocks, $ for inline)
            - Common Pitfalls/Mistakes
            - Example Problems
        `;

        const { output } = await ai.generate({
            prompt: prompt,
            output: { schema: z.object({ markdown: z.string() }) }
        });

        if (!output) {
            throw new Error("Failed to generate notes");
        }

        return output;
    }
);

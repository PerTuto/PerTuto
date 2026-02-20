import { z } from 'zod';
import { ai } from '../config/genkit';

const QuestionSchema = z.object({
    stem: z.string().describe("The main question text"),
    options: z.array(z.string()).optional().describe("Multiple choice options if applicable"),
    answer: z.string().describe("The correct answer"),
    explanation: z.string().describe("Step-by-step explanation"),
    difficulty: z.enum(['1', '2', '3']).describe("Difficulty level: 1=Easy, 2=Medium, 3=Hard")
});

const PdfExtractionInput = z.object({
    pdfBase64: z.string().describe("Base64 encoded PDF content"),
    topic: z.string().optional(),
    curriculum: z.string().optional(),
});

export const extractQuestionsFromPdfFlow = ai.defineFlow(
    {
        name: 'extractQuestionsFromPdf',
        inputSchema: PdfExtractionInput,
        outputSchema: z.object({
            questions: z.array(QuestionSchema)
        }),
    },
    async (input) => {
        const { pdfBase64, topic, curriculum } = input;

        const systemPrompt = `
            You are an expert ${curriculum || 'educational'} content creator. 
            Extract high-quality practice questions from the provided PDF.
            
            Context:
            - Topic: ${topic || 'General'}
            - Curriculum: ${curriculum || 'Standard'}
            
            Guidelines:
            1. Extract exactly 5-10 questions if possible.
            2. For Math/Physics, use LaTeX for mathematical expressions (e.g., $x^2$).
            3. Ensure the output strictly matches the required JSON schema.
            4. Include clear, pedagogical explanations for each answer.
        `;

        const { output } = await ai.generate({
            model: 'googleai/gemini-1.5-pro-latest',
            system: systemPrompt,
            prompt: [
                {
                    data: {
                        content: pdfBase64,
                        contentType: 'application/pdf'
                    }
                },
                { text: "Extract questions from this document following the system instructions." }
            ],
            output: { schema: z.object({ questions: z.array(QuestionSchema) }) }
        });

        if (!output) {
            throw new Error("Failed to extract questions from PDF");
        }

        return output;
    }
);

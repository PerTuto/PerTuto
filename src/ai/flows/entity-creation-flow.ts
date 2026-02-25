'use server';
/**
 * @fileOverview This file defines a Genkit flow for creating entities (students or leads) using natural language.
 *
 * @exports {createEntityWithNaturalLanguage} - The main function to trigger the flow.
 * @exports {CreateEntityInput} - The input type for the flow.
 * @exports {CreateEntityOutput} - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CreateEntityInputSchema = z.object({
  naturalLanguageInput: z
    .string()
    .describe(
      'A natural language description for creating a student or a lead. e.g., "New lead: Mike Smith, phone 555-1234" or "Add student Jane Doe, email jane.d@example.com, for Python course"'
    ),
});
export type CreateEntityInput = z.infer<typeof CreateEntityInputSchema>;

const StudentSchema = z.object({
  entityType: z.literal('student'),
  name: z.string().describe("The full name of the student."),
  email: z.string().describe("The student's email address.").optional(),
  course: z.string().describe("The course the student is enrolling in.").optional(),
});

const LeadSchema = z.object({
    entityType: z.literal('lead'),
    name: z.string().describe("The full name of the lead."),
    email: z.string().describe("The lead's email address.").optional(),
    phone: z.string().describe("The lead's phone number.").optional(),
});

export const CreateEntityOutputSchema = z.union([
    StudentSchema,
    LeadSchema,
    z.object({entityType: z.literal('none')})
]);
export type CreateEntityOutput = z.infer<typeof CreateEntityOutputSchema>;


import { checkAIRateLimit } from '@/ai/rate-limiter';

export async function createEntityWithNaturalLanguage(
  input: CreateEntityInput
): Promise<CreateEntityOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) throw new Error("Rate limit exceeded. Please try again later.");
  return createEntityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createEntityPrompt',
  input: {schema: CreateEntityInputSchema},
  output: {schema: CreateEntityOutputSchema},
  prompt: `You are an assistant that creates student or lead records from natural language.
Determine if the user wants to create a 'student' or a 'lead'.

Extract the following information from the user's input:
- For a student: name, email, and course.
- For a lead: name, email, and phone number.

User Input: {{{naturalLanguageInput}}}

Based on the input, determine the entityType and extract the relevant fields.
If the input is not clearly a request to create a student or a lead, return an entityType of 'none'.
`,
});

const createEntityFlow = ai.defineFlow(
  {
    name: 'createEntityFlow',
    inputSchema: CreateEntityInputSchema,
    outputSchema: CreateEntityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview This file defines a Genkit flow for creating classes using natural language input.
 *
 * The flow takes a natural language description of a class schedule as input, extracts the relevant information,
 * and returns a structured object containing the class details.
 *
 * @exports {naturalLanguageClassCreation} - The main function to trigger the flow.
 * @exports {NaturalLanguageClassCreationInput} - The input type for the naturalLanguageClassCreation function.
 * @exports {NaturalLanguageClassCreationOutput} - The output type for the naturalLanguageClassCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageClassCreationInputSchema = z.object({
  naturalLanguageInput: z
    .string()
    .describe(
      'A natural language description of the class schedule, e.g., Schedule a class on Monday at 2 PM for Advanced Math.'
    ),
});
export type NaturalLanguageClassCreationInput = z.infer<
  typeof NaturalLanguageClassCreationInputSchema
>;

const NaturalLanguageClassCreationOutputSchema = z.object({
  className: z.string().describe('The name of the class.'),
  dayOfWeek: z
    .string()
    .describe('The day of the week the class is scheduled for.'),
  time: z.string().describe('The time the class is scheduled for (e.g., 2:00 PM).'),
  course: z.string().describe('The course name of class is scheduled for.'),
});

export type NaturalLanguageClassCreationOutput = z.infer<
  typeof NaturalLanguageClassCreationOutputSchema
>;

import { checkAIRateLimit } from '@/ai/rate-limiter';

export async function naturalLanguageClassCreation(
  input: NaturalLanguageClassCreationInput
): Promise<NaturalLanguageClassCreationOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) throw new Error("Rate limit exceeded. Please try again later.");
  return naturalLanguageClassCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageClassCreationPrompt',
  input: {schema: NaturalLanguageClassCreationInputSchema},
  output: {schema: NaturalLanguageClassCreationOutputSchema},
  prompt: `You are a class scheduling assistant. Your task is to extract relevant information from the user's natural language input and create a class schedule.

  Extract the class name, day of the week, time, and course from the following input:
  {{naturalLanguageInput}}

  Return the information in a structured format.
  Ensure that the time is formatted as 2:00 PM. If the course is not mentioned in input, name it "Miscellaneous".
  If the day of the week cannot be determined from the input, set the dayOfWeek to "Unspecified".
  If the user input is not related to scheduling a class, respond with an empty JSON object.
  `,
});

const naturalLanguageClassCreationFlow = ai.defineFlow(
  {
    name: 'naturalLanguageClassCreationFlow',
    inputSchema: NaturalLanguageClassCreationInputSchema,
    outputSchema: NaturalLanguageClassCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

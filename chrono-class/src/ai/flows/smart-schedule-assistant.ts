'use server';

/**
 * @fileOverview Implements the Smart Schedule Assistant flow to suggest optimal class times and locations.
 *
 * - smartScheduleAssistant - A function that handles the smart scheduling process.
 * - SmartScheduleAssistantInput - The input type for the smartScheduleAssistant function.
 * - SmartScheduleAssistantOutput - The return type for the smartScheduleAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartScheduleAssistantInputSchema = z.object({
  instructorAvailability: z
    .string()
    .describe(
      'A string representing the instructor availability, including time zones.'
    ),
  classroomResources: z
    .string()
    .describe('A string describing the available classroom resources.'),
  studentPreferences: z
    .string()
    .describe('A string representing the student preferences for scheduling.'),
  classDuration: z
    .string()
    .describe('The duration of the class. e.g. 1 hour, 90 minutes'),
  className: z.string().describe('The name of the class to schedule.'),
});
export type SmartScheduleAssistantInput = z.infer<
  typeof SmartScheduleAssistantInputSchema
>;

const SmartScheduleAssistantOutputSchema = z.object({
  suggestedSchedule: z
    .string()
    .describe(
      'A string containing the suggested schedule, including the optimal time and location.'
    ),
  conflictsDetected: z
    .string()
    .describe(
      'A string explaining any conflicts detected during the scheduling process.'
    ),
  suggestedDate: z.string().optional().describe('ISO date string (YYYY-MM-DD) for the suggested alternative.'),
  suggestedStartTime: z.string().optional().describe('24h time string (HH:MM) for the suggested start.'),
  suggestedEndTime: z.string().optional().describe('24h time string (HH:MM) for the suggested end.'),
});
export type SmartScheduleAssistantOutput = z.infer<
  typeof SmartScheduleAssistantOutputSchema
>;

export async function smartScheduleAssistant(
  input: SmartScheduleAssistantInput
): Promise<SmartScheduleAssistantOutput> {
  return smartScheduleAssistantFlow(input);
}

const smartScheduleAssistantPrompt = ai.definePrompt({
  name: 'smartScheduleAssistantPrompt',
  input: { schema: SmartScheduleAssistantInputSchema },
  output: { schema: SmartScheduleAssistantOutputSchema },
  prompt: `You are a scheduling assistant. Analyze the provided instructor availability, classroom resources, and student preferences to suggest the optimal class time and location.

Instructor Availability: {{{instructorAvailability}}}
Classroom Resources: {{{classroomResources}}}
Student Preferences: {{{studentPreferences}}}
Class Duration: {{{classDuration}}}
Class Name: {{{className}}}

Based on this information, suggest the best schedule and identify any potential conflicts.
If there is a conflict, provide an alternative suggestion in structured format (date in YYYY-MM-DD, times in HH:MM).

Output the suggested schedule, any conflicts detected, and the structured suggestion if applicable.`,
});

const smartScheduleAssistantFlow = ai.defineFlow(
  {
    name: 'smartScheduleAssistantFlow',
    inputSchema: SmartScheduleAssistantInputSchema,
    outputSchema: SmartScheduleAssistantOutputSchema,
  },
  async input => {
    const { output } = await smartScheduleAssistantPrompt(input);
    return output!;
  }
);

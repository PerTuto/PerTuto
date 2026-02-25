'use server';

/**
 * @fileOverview Generates Google Meet links for scheduled classes.
 *
 * - generateMeetLink - A function to generate a Google Meet link.
 * - GenerateMeetLinkInput - The input type for the generateMeetLink function.
 * - GenerateMeetLinkOutput - The return type for the generateMeetLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMeetLinkInputSchema = z.object({
  topic: z.string().describe('The topic of the class for which the Meet link is being generated.'),
  scheduledTime: z.string().describe('The scheduled time of the class.'),
});
export type GenerateMeetLinkInput = z.infer<typeof GenerateMeetLinkInputSchema>;

const GenerateMeetLinkOutputSchema = z.object({
  meetLink: z.string().describe('The generated Google Meet link for the class.'),
});
export type GenerateMeetLinkOutput = z.infer<typeof GenerateMeetLinkOutputSchema>;

import { checkAIRateLimit } from '@/ai/rate-limiter';

export async function generateMeetLink(input: GenerateMeetLinkInput): Promise<GenerateMeetLinkOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) throw new Error("Rate limit exceeded. Please try again later.");
  return generateMeetLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMeetLinkPrompt',
  input: {schema: GenerateMeetLinkInputSchema},
  output: {schema: GenerateMeetLinkOutputSchema},
  prompt: `You are a virtual assistant helping to schedule classes and generate Google Meet links.
  Generate a Google Meet link for the class with the following details:

  Topic: {{{topic}}}
  Scheduled Time: {{{scheduledTime}}}

  Return only the Google Meet link.`,
});

const generateMeetLinkFlow = ai.defineFlow(
  {
    name: 'generateMeetLinkFlow',
    inputSchema: GenerateMeetLinkInputSchema,
    outputSchema: GenerateMeetLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

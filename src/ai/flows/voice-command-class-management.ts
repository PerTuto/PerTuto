'use server';

/**
 * @fileOverview Manages classes via voice commands using Gemini.
 *
 * - voiceCommandClassManagement - A function that handles class management through voice commands.
 * - VoiceCommandClassManagementInput - The input type for the voiceCommandClassManagement function.
 * - VoiceCommandClassManagementOutput - The return type for the voiceCommandClassManagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceCommandClassManagementInputSchema = z.object({
  voiceCommand: z.string().describe('The voice command to execute for class management.'),
});
export type VoiceCommandClassManagementInput = z.infer<typeof VoiceCommandClassManagementInputSchema>;

const VoiceCommandClassManagementOutputSchema = z.object({
  success: z.boolean().describe('Whether the command was successfully executed.'),
  message: z.string().describe('A message indicating the result of the command execution.'),
});
export type VoiceCommandClassManagementOutput = z.infer<typeof VoiceCommandClassManagementOutputSchema>;

import { checkAIRateLimit } from '@/ai/rate-limiter';

export async function voiceCommandClassManagement(input: VoiceCommandClassManagementInput): Promise<VoiceCommandClassManagementOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) {
    return { success: false, message: "Rate limit exceeded. Please try again later." };
  }
  return voiceCommandClassManagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCommandClassManagementPrompt',
  input: {schema: VoiceCommandClassManagementInputSchema},
  output: {schema: VoiceCommandClassManagementOutputSchema},
  prompt: `You are a voice assistant that helps the super-user manage classes.

The super-user will provide a voice command, and you must interpret it and respond with a success or failure message.

Examples of voice commands include:
- Schedule a class on Monday at 2 PM for Advanced Math
- Reschedule the Tuesday class to Wednesday at the same time
- Cancel the upcoming Calculus session

Voice Command: {{{voiceCommand}}}
`,
});

const voiceCommandClassManagementFlow = ai.defineFlow(
  {
    name: 'voiceCommandClassManagementFlow',
    inputSchema: VoiceCommandClassManagementInputSchema,
    outputSchema: VoiceCommandClassManagementOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      // Assuming the prompt returns a structured output, you might need to parse it here
      // and determine success based on the parsed output.

      // Placeholder logic for command execution (replace with actual implementation)
      const commandResult = output?.message || 'Command processed.';

      return {
        success: true, // Assume success after prompt execution (adjust as needed)
        message: commandResult,
      };
    } catch (error: any) {
      console.error('Error processing voice command:', error);
      return {
        success: false,
        message: `Failed to process voice command: ${error.message}`,
      };
    }
  }
);

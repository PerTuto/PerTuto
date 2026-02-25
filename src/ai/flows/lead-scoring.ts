'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { checkAIRateLimit } from '@/ai/rate-limiter';

const LeadScoringInputSchema = z.object({
  name: z.string(),
  subject: z.string().optional(),
  packageParams: z.string().optional(),
  phone: z.string().optional(),
});

const LeadScoringOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A score from 0-100 indicating the quality/intent of the lead.'),
  category: z.enum(['Hot', 'Warm', 'Cold']).describe('The temperature of the lead.'),
  reasoning: z.string().describe('Short explanation for the score.'),
});

export type LeadScoringOutput = z.infer<typeof LeadScoringOutputSchema>;

export async function scoreLeadWithAI(input: z.infer<typeof LeadScoringInputSchema>): Promise<LeadScoringOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) return { score: 50, category: 'Warm', reasoning: 'Rate limit exceeded, default applied.' };
  
  return leadScoringFlow(input);
}

const leadScoringPrompt = ai.definePrompt({
  name: 'leadScoringPrompt',
  input: { schema: LeadScoringInputSchema },
  output: { schema: LeadScoringOutputSchema },
  prompt: `
    You are a sales assistant for PerTuto, a premium tutoring company. 
    Analyze the following lead inquiry and score it based on purchase intent and clarity.
    
    Lead Name: {{name}}
    Subject/Topic: {{subject}}
    Package/Interest: {{packageParams}}
    
    Hot leads (80-100): Clear intent, specific subjects (e.g., "SAT Math"), or package mentions.
    Warm leads (40-79): General inquiries with contact info.
    Cold leads (0-39): Vague or suspicious/spam-like entries.
    
    Provide the score, category, and a one-sentence reasoning.
  `,
});

const leadScoringFlow = ai.defineFlow(
  {
    name: 'leadScoringFlow',
    inputSchema: LeadScoringInputSchema,
    outputSchema: LeadScoringOutputSchema,
  },
  async input => {
    const { output } = await leadScoringPrompt(input);
    return output!;
  }
);

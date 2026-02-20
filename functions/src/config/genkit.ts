import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-1.5-pro-latest',
});

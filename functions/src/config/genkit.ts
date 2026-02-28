import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { defineSecret } from "firebase-functions/params";

export const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

enableFirebaseTelemetry();

export const ai = genkit({
    plugins: [googleAI()],
});

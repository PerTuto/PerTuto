import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { defineSecret } from "firebase-functions/params";

// Import shared Firebase Admin initialization (idempotent).
// This ensures the same app instance is used everywhere.
import "./firebaseAdmin";

export const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// Only enable telemetry in non-development environments if needed,
// or keep it for all to see traces in GCP.
enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [googleAI()],
});

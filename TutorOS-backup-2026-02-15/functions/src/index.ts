import { setGlobalOptions } from "firebase-functions";
import { onCallGenkit } from "firebase-functions/https";
// import { onRequest } from "firebase-functions/v2/https";
// import next from "next";
import { apiKey } from "./genkit";
import { worksheetExtractorFlow } from "./flows/extractor";
import { quizCuratorFlow } from "./flows/curator";
import { questionValidatorFlow } from "./flows/validator";
import { questionEnhancerFlow } from "./flows/enhancer";

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
  memory: "2GiB",
  timeoutSeconds: 300,
});

// Export Genkit flows as callable Cloud Functions
export const worksheetExtractor = onCallGenkit(
  {
    secrets: [apiKey],
    invoker: "public",
    cors: "*", // Explicitly allow all origins for preview support
  },
  worksheetExtractorFlow,
);

export const quizCurator = onCallGenkit(
  {
    secrets: [apiKey],
    invoker: "public",
    cors: true,
  },
  quizCuratorFlow,
);

export const questionValidator = onCallGenkit(
  {
    secrets: [apiKey],
    invoker: "public",
    cors: true,
  },
  questionValidatorFlow,
);

export const questionEnhancer = onCallGenkit(
  {
    secrets: [apiKey],
    invoker: "public",
    cors: true,
  },
  questionEnhancerFlow,
);

// SSR function removed - using Firebase App Hosting instead
// export const ssrdatabanktutoros = onRequest(async (req, res) => {
//   await app.prepare();
//   return handle(req, res);
// });

// Export original sample for reference/testing if needed
export { menuSuggestion } from "./genkit-sample";

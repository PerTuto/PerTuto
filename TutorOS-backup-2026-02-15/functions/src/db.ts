// Re-export from the shared initialization module.
// This file exists for backward compatibility — all imports of { db }
// from "./db" continue to work without changes.
export { db } from "./firebaseAdmin";

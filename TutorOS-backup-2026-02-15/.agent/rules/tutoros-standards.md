# TutorOS Development Standards

- This is a Next.js frontend + Firebase Cloud Functions (Genkit) backend project
- TypeScript strict mode — all changes must pass `tsc --noEmit` with zero errors
- Never call `initializeApp()` directly — always import from `firebaseAdmin.ts`
- The canonical Question type lives in `question.ts` — all consumers must use this single source of truth
- Backend AI extraction returns data shaped by `ExtractionResponseSchema` in `extractor.ts` — the frontend must accommodate this shape
- When modifying Firestore security rules, always test with the Firebase Emulator before deploying
- All enum values must be documented with their source (backend AI vs frontend manual creation)
- Do not create duplicate/parallel fields for the same data (e.g., no `stemMarkdown` alongside `content`)

# TutorOS

**AI-Powered Math Tutoring Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## Overview

TutorOS is an AI-powered tutoring platform for managing large question banks, creating curriculum-aligned quizzes, and delivering personalized learning experiences.

### Key Features

- 📚 **Question Bank** - 1M+ questions with 4D taxonomy
- 🤖 **AI Worksheet Extractor** - PDF parsing with Gemini 3 Pro
- 🎯 **Quiz Curator** - Natural language quiz assembly
- 📊 **Multi-Curriculum** - SAT, AMC, IB support

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | Next.js 16.1.6, React 19.2.3      |
| Backend  | Firebase Functions, Genkit 1.28.0 |
| Database | Firestore                         |
| AI       | Gemini 3 Flash / 1.5 Pro          |
| Hosting  | Firebase App Hosting              |

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud account

### Installation

```bash
# Clone repository
git clone https://github.com/KernelFierce/TutorOS.git
cd TutorOS

# Install dependencies
npm install
cd functions && npm install && cd ..
cd tutoros && npm install && cd ..

# Copy environment template
cp env.template .env.local
# Fill in your Firebase config values

# Start development
npm run dev
```

### Firebase Emulators

```bash
firebase emulators:start
```

Emulator UI: http://localhost:4000

## Project Structure

```
TutorOS/
├── src/                    # Next.js app
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── functions/             # Cloud Functions
├── tutoros/               # Genkit AI flows
├── docs/                  # Documentation
│   └── planning/          # BRD, Technical Scope, Timeline
└── firebase.json          # Firebase config
```

## Development

```bash
npm run dev         # Start Next.js dev server
npm run build       # Build for production
npm run lint        # Run ESLint
firebase serve      # Test hosting locally
firebase deploy     # Deploy to Firebase
```

## Documentation

- [Business Requirements](docs/planning/BRD_TutorOS.md)
- [Technical Scope](docs/planning/Technical_Scope_TutorOS.md)
- [Timeline](docs/planning/Timeline_TutorOS.md)

## License

Private - All Rights Reserved

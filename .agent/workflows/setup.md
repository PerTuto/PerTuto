---
description: How to setup the development environment
---

This workflow guides you through setting up the development environment for the Pertuto Tutoring project.

## Prerequisites

Ensure you have the following installed:
- **Homebrew** (for macOS)
- **Firebase CLI**: `brew install firebase-cli`

## 1. Install Node.js 20

The project requires Node.js 20.

```bash
brew install node@20
brew link --force --overwrite node@20
```

Verify installation:
```bash
node --version
# Should be v20.x.x
```

## 2. Install Dependencies

### Root Project (React + Vite)
```bash
cd /Users/ankur/Antigravity/pertuto-tutoring
// turbo
npm install --legacy-peer-deps
```

### Firebase Functions
```bash
cd /Users/ankur/Antigravity/pertuto-tutoring/functions
// turbo
npm install
```

### Chrono Class (Next.js Subproject)
```bash
cd /Users/ankur/Antigravity/pertuto-tutoring/chrono-class
// turbo
npm install
```

## 3. Firebase Setup

Login to Firebase:
```bash
firebase login
```

## 4. Run Development Server

To start the main application:
```bash
cd /Users/ankur/Antigravity/pertuto-tutoring
npm run dev
```

To run Firebase emulators (if needed):
```bash
cd /Users/ankur/Antigravity/pertuto-tutoring
firebase emulators:start
```

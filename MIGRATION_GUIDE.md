# 🍎 Mac Migration Guide for PerTuto

Since the automatic GitHub sync encountered authentication issues, here is the manual way to move your project to your new MacBook.

## Step 1: Copy Files
Copy the entire `pertuto-tutoring` folder to your Mac, **BUT** you can skip these huge folders to save time/space:
*   ❌ `node_modules`
*   ❌ `.firebase`
*   ❌ `dist`

**Make sure you definitely copy:**
*   ✅ `src` folder
*   ✅ `public` folder
*   ✅ `package.json`
*   ✅ `vite.config.ts`, `firebase.json`, `tsconfig.json`
*   ✅ `setup_github.ps1` (Script we created)
*   ✅ All `.md` files (including this one!)

## Step 2: Set Up on Mac
1.  **Install Node.js**: Download the "LTS" version from [nodejs.org](https://nodejs.org/).
2.  **Install VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
3.  **Open Project**: Open the `pertuto-tutoring` folder in VS Code.

## Step 3: Install & Run
Open the Terminal in VS Code (`Cmd + J`) and run:

1.  **Install Dependencies** (restores `node_modules`):
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm run dev
    ```

## Step 4: Re-connect Git (Optional)
If you want to try pushing to GitHub again from the Mac (it's often easier there):
1.  Install Git (if not already prompted).
2.  Run `git status` to check your files.
3.  Authenticate:
    ```bash
    gh auth login
    ```
4.  Create the repo:
    ```bash
    gh repo create pertuto-tutoring --private --source=. --remote=origin --push
    ```

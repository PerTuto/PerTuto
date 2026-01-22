# Project Migration Guide: Moving to MacBook

Welcome to your new MacBook! Follow these steps to get your `pertuto-tutoring` project up and running.

## 1. Prerequisites (Install these first)

- **Node.js**: You need Node.js to run the project.
  - Download and install the LTS version from [nodejs.org](https://nodejs.org/).
  - Verify install in terminal: `node -v` (should be v18 or higher).
- **Git**: Usually installed by default, but verify with `git --version`.
- **VS Code**: Recommended editor. [Download here](https://code.visualstudio.com/).
- **GitHub CLI (Optional but helpful)**: `brew install gh` (requires Homebrew) or download from [cli.github.com](https://cli.github.com/).

## 2. Clone the Repository

Open your Terminal and run:

```bash
# Navigate to where you want the project (e.g., specific folder)
cd ~/Documents

# Clone the repo (you will be asked for GitHub credentials)
git clone https://github.com/YOUR_GITHUB_USERNAME/pertuto-tutoring.git

# Enter the directory
cd pertuto-tutoring
```

*Note: Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.*

## 3. Install Dependencies

Install the project libraries:

```bash
npm install
```

## 4. Run the Project

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173` (or the port shown in the terminal).

## 5. Troubleshooting

- **Permissions**: If you get permission errors, you might need to use `sudo` (use carefully) or fix npm permissions.
- **Missing Environment Variables**: If the app crashes or features are missing, check if you need a `.env` file.
  - *Current Status from Windows*: No `.env` files were found in the root directory during migration, so you should be good to go!

## 6. Next Steps

- You can now delete the `setup_github.ps1` file if it was carried over (it shouldn't be if we ignored it correctly).
- Happy Coding on your new Mac!

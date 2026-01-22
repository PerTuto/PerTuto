/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keeping custom colors if we need them, or relying on defaults
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern font
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'cinematic': '0 0 20px rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}

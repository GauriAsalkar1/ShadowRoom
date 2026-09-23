/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0b14',
        foreground: '#ededee',
        card: '#1a1a2e',
        border: 'rgba(255, 255, 255, 0.1)',
        muted: {
          foreground: '#a1a1aa',
        },
        secondary: {
          DEFAULT: '#2a2a3e',
          foreground: '#ededee',
        },
      },
    },
  },
  plugins: [],
}
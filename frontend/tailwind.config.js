/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f3f2f',
          light: '#1a5a45',
        },
        secondary: {
          DEFAULT: '#7cc9b0',
          light: '#a1e0cb',
        },
      },
    },
  },
  plugins: [],
}

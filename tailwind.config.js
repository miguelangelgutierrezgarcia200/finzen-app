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
        brand: {
          bg: '#1B120D',
          card: '#251A14',
          card2: '#33221A',
          jade: '#2D9E6B',
          gold: '#F4B942',
          wine: '#9C4F6E',
          red: '#C23616',
          cream: '#F7E9DA',
          taupe: '#B08D74',
          ink: '#2A160D',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
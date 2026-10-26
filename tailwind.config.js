/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        siakad: {
          red: '#D32F2F',
          darkRed: '#B71C1C',
          lightRed: '#FFEBEE',
          gray: '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
}

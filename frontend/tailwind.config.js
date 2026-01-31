/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ramtekRed: "#FF4D4D", // Adding our constant color here
      },
    },
  },
  plugins: [],
}
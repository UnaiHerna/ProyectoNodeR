import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cimico: '#072AC8',
        botonColor: 'rgb(31 61 195)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

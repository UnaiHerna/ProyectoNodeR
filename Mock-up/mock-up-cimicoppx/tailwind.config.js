const { nextui } = require('@nextui-org/theme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|badge|button|card|navbar|select|ripple|spinner|listbox|divider|popover|scroll-shadow).js"
  ],
  theme: {
    extend: {
      backgroundColor: { // Cambié a backgroundColor
        cimico: "#132568", // Asegúrate de que esté dentro de `backgroundColor`
      },
      textColor:{
        cimicoText: "#0c78ac",
      }
    },
  },
  plugins: [nextui()],
};

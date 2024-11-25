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
      backgroundColor: {
        cimico: "#132568",
        cimicoLine: "#98e4fc", 
      },
      textColor:{
        cimicoText: "#0c78ac",
      },
      fontFamily:{
        raleway: "Raleway",
        lato: "Lato",
        roboto: "Roboto",
        aptos: ['Aptos', 'sans-serif'],
      },
    },
  },
  plugins: [nextui()],
};

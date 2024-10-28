const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|badge|button|card|select|ripple|spinner|listbox|divider|popover|scroll-shadow).js"
  ].js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
}
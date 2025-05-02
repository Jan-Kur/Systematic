/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#09080c",
          DEFAULT: "#F6F5FF"
        },
        text: {
          dark: "#09080c",
          DEFAULT: "#F6F5FF"
        },
        primary: "#751FCC",
      }
    },
  },
  plugins: [],
}


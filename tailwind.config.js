/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lightMain: "#F6F5FF",
        darkMain: "#08060A",
        primary: "#6A1FCC",
        darkGray: "#202020",
        lightGray: "#444444",
      },
      fontFamily: {
        geist: ["Geist"],
      },
    },
  },
  plugins: [],
}



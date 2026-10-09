/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#10140c",
        },
        copper: {
          300: "#e7ff9a",
          400: "#d2ff3d",
          500: "#b0db12",
          600: "#86a80a",
          700: "#5c7308",
        },
        tide: {
          300: "#c4b5fd",
          400: "#8b6cff",
          500: "#6d4dff",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 16px 40px -18px rgba(210, 255, 61, 0.55)",
      },
    },
  },
  plugins: [],
};

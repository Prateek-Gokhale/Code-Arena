/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          orange: "#ffa116",
          panel: "rgb(var(--panel) / <alpha-value>)",
          page: "rgb(var(--page) / <alpha-value>)",
          line: "rgb(var(--line) / <alpha-value>)",
          text: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--muted) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "0 16px 50px rgb(0 0 0 / 0.12)"
      }
    }
  },
  plugins: []
};

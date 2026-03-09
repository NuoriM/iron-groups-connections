/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "lg:grid-cols-4",
    // ou com padrão:
    { pattern: /grid-cols-.+/, variants: ["lg", "xl"] }
  ],
  theme: {
    extend: {

    },
  },
  plugins: [],
}


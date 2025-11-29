/** @type {import('tailwindcss').Config} */
export default {
  // with v4 + @tailwindcss/vite, content is auto, but it's fine to keep this:
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Poppins", "sans-serif"] },
      colors: {
        primary: { DEFAULT: "#2563eb", dark: "#1e40af" },
        secondary: { DEFAULT: "#8b5cf6", dark: "#6d28d9" },
        accent: "#10b981",
      },
    },
  },
  plugins: [],
};
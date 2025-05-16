/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          100: "#FDFCFB",
          200: "#FAF7F2",
          300: "#E8DCD0",
          400: "#C6BEB4",
        },
        lavender: "#6C63FF",
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

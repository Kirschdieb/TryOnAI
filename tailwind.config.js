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
        slate: {
          200: "#E2E8F0",
          300: "#CBD5E1",
          600: "#475569",
        },
        purple: {
          200: "#E9D5FF",
          600: "#9333EA",
        }
      },
      fontSize: {
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      zIndex: {
        '-10': '-10',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

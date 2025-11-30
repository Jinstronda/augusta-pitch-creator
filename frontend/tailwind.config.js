/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f13",
        surface: "#1e1e24",
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#f472b6",
      },
      animation: {
        'pan-right': 'panRight 1s ease-in-out forwards',
      },
      keyframes: {
        panRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-20%)' },
        }
      }
    },
  },
  plugins: [],
}

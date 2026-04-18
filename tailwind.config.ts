/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        chassis: '#000827',
        ignitionRed: '#bb0016',
        telemetryYellow: {
          DEFAULT: '#f1c100',
          dark: '#745b00',
        },
        surface: {
          base: '#f9f9f9',
          layered: '#e2e2e2',
          container: '#ececec',
        }
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #bb0016 0%, #8a0010 100%)',
        'navy-gradient': 'linear-gradient(135deg, #000827 0%, #00124d 100%)',
      },
      borderRadius: {
        'sm': '2px',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f4fa',
          100: '#c4e8f5',
          200: '#a1dcf0',
          300: '#7ecdeb',
          400: '#00A6E2',
          500: '#2760A3',
          600: '#103463',
          700: '#0c2a50',
          800: '#092040',
          900: '#07162B',
        },
      },
    },
  },
  plugins: [],
};

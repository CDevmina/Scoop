/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#121212', //Grey
        secondary: '#E5090F', //Red
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Bebas Neue', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [
    import('@tailwindcss/aspect-ratio'),
  ],
}
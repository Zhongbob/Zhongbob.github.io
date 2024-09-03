/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundColor: '#1E1E1E',
        secondaryColor1: '#252526',
        secondaryColor2: '#393939',
        textColor1: '#FFFFFF',
        textColor2: '#D1D2D2',
        textColor3: '#9BDCFE',
        headerColor: '#C8754D',
        highlightColor: '#569CD6',
      },
    },
  },
  plugins: [],
}


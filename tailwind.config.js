/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animationDirection: {
        normal: 'normal',
        reverse: 'reverse',
        alternate: 'alternate',
        'alternate-reverse': 'alternate-reverse',
      },
      animationFillMode: {
        forwards: 'forwards',
        backwards: 'backwards',
        both: 'both',
        none: 'none',
      },

      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '1000': '1000ms',
      },
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
      keyframes: {
        type: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInFromTop: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInFromBottom: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeOutToTop: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        fadeOutToLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-20px)' },
        },
        fadeOutToBottom: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        fadeOutToRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(20px)' },
        },
        cursor: {
          '0%': { left: '100%', top: '60%' },
          '11.9999%': { left: '0%', top: '40%', backgroundPosition: '0 0' },
          '12%': { left: '0%', top: '40%', backgroundPosition: '-32px 0' },
          '22%': { left: '0%', top: '40%', backgroundPosition: '-32px 0' },
          '22.001%': { left: '0%', top: '40%', backgroundPosition: '0 0' },
          '34%': { left: '100%', top: '50%' },
          '44%': { left: '100%', top: '50%' },
          '59.999%': { left: '3%', top: '3%', backgroundPosition: '0 0' },
          '60%': { left: '3%', top: '3%', backgroundPosition: '-32px 0' },
          '70%': { left: '3%', top: '3%', backgroundPosition: '-32px 0' },
          '70.001%': { left: '3%', top: '3%', backgroundPosition: '0 0' },
          '75%': { left: '3%', top: '3%' },
          '100%': { left: '300%', top: '50%'},
        },
      },
      animation: {
        fadeInFromTop: 'fadeInFromTop 1s ease-in-out',
        fadeInFromLeft: 'fadeInFromLeft 1s ease-in-out',
        fadeInFromBottom: 'fadeInFromBottom 1s ease-in-out',
        fadeInFromRight: 'fadeInFromRight 1s ease-in-out',
        fadeOutToTop: 'fadeOutToTop 1s ease-in-out',
        fadeOutToLeft: 'fadeOutToLeft 1s ease-in-out',
        fadeOutToBottom: 'fadeOutToBottom 1s ease-in-out',
        fadeOutToRight: 'fadeOutToRight 1s ease-in-out',
        cursor: 'cursor 5s forwards', // Customize duration and other properties
        type: 'type 0.7s infinite alternate',
      },

    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.animate-delay-100': { 'animation-delay': '100ms' },
        '.animate-delay-200': { 'animation-delay': '200ms' },
        '.animate-delay-300': { 'animation-delay': '300ms' },
        '.animate-delay-500': { 'animation-delay': '500ms' },
        '.animate-delay-1000': { 'animation-delay': '1000ms' },
        '.animate-fill-forwards': { 'animation-fill-mode': 'forwards' },
        '.animate-fill-backwards': { 'animation-fill-mode': 'backwards' },
        '.animate-fill-both': { 'animation-fill-mode': 'both' },
        '.animate-direction-normal': { 'animation-direction': 'normal' },
        '.animate-direction-reverse': { 'animation-direction': 'reverse' },
        '.animate-direction-alternate': { 'animation-direction': 'alternate' },
        '.animate-direction-alternate-reverse': { 'animation-direction': 'alternate-reverse' },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}


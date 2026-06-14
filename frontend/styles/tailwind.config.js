// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      raleway: ['Raleway', 'sans-serif'],
      sans: ['Raleway', 'sans-serif'],
    },
    extend: {
      colors: {
        background: withOpacity('--color-background'),
        surface: withOpacity('--color-surface'),
        primary: withOpacity('--color-primary'),
        secondary: withOpacity('--color-secondary'),
        text: withOpacity('--color-text'),
        'text-secondary': withOpacity('--color-text-secondary'),
        border: withOpacity('--color-border'),
        shadow: withOpacity('--color-shadow'),
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neumorphic': '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 15px rgba(6, 182, 212, 0.5)',
        'glow-lg': '0 0 25px rgba(6, 182, 212, 0.7)',
        'inner-glow': 'inset 0 0 10px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      transitionProperty: {
        'size': 'width, height',
        'spacing': 'margin, padding',
        'position': 'top, right, bottom, left',
        'colors': 'color, background-color, border-color, fill, stroke',
        'all': 'all',
      },
      zIndex: {
        'max': '9999',
        'modal': '1000',
        'dropdown': '900',
        'overlay': '800',
        'header': '700',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    require('tailwindcss-text-fill-stroke'),
  ],
}

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}
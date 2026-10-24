/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf4',
          100: '#d8f3e3',
          200: '#b4e6cb',
          300: '#83d3ac',
          400: '#4fba88',
          500: '#2c9f6d',
          600: '#1e8057',
          700: '#196648',
          800: '#17513b',
          900: '#144332',
        },
        // Warm paper tones used for page and surface backgrounds.
        sand: {
          50: '#fbf7f0',
          100: '#f5eee2',
          200: '#eadfcd',
          300: '#dbcbb1',
          400: '#c5b08e',
          500: '#a9926d',
          600: '#8a7354',
        },
        // Neutral text tones with a faint green cast.
        ink: {
          50: '#f6f7f5',
          100: '#e9ebe7',
          200: '#d3d8d1',
          300: '#adb6ad',
          400: '#7f8d83',
          500: '#5c6b61',
          600: '#45534a',
          700: '#34403a',
          800: '#232d28',
          900: '#141c18',
        },
        // Terracotta accent for highlights and warnings.
        accent: {
          50: '#fdf4ee',
          100: '#f9e3d6',
          200: '#f2c6ae',
          300: '#e6a07c',
          400: '#d77e54',
          500: '#c2603a',
          600: '#a44a2c',
          700: '#853b25',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20, 28, 23, 0.04), 0 10px 30px -18px rgba(20, 28, 23, 0.25)',
        lift: '0 2px 4px rgba(20, 28, 23, 0.05), 0 20px 40px -20px rgba(20, 28, 23, 0.35)',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 200ms ease-out',
        'rise-in': 'rise-in 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

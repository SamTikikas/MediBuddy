/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite alternate',
        'gradient': 'gradient-shift 6s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { 
            opacity: '0.5',
            transform: 'translateX(-100%)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(100%)'
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fitness-themed color palette
        fitness: {
          // Electric blues
          'electric-50': '#e6f3ff',
          'electric-100': '#b3daff',
          'electric-500': '#0080ff',
          'electric-600': '#0066cc',
          'electric-700': '#004d99',
          'electric-900': '#001a33',

          // Energy oranges
          'energy-50': '#fff7e6',
          'energy-100': '#ffe0b3',
          'energy-400': '#ff9900',
          'energy-500': '#ff8000',
          'energy-600': '#e67300',
          'energy-700': '#cc5500',

          // Power reds
          'power-400': '#ff4444',
          'power-500': '#ff3333',
          'power-600': '#e62e2e',
          'power-700': '#cc1f1f',

          // Strong grays
          'steel-50': '#f8f9fa',
          'steel-100': '#e9ecef',
          'steel-200': '#dee2e6',
          'steel-300': '#ced4da',
          'steel-400': '#6c757d',
          'steel-500': '#495057',
          'steel-600': '#343a40',
          'steel-700': '#212529',
          'steel-800': '#1a1d20',
          'steel-900': '#0d1117',
        }
      },
      backgroundImage: {
        'fitness-gradient': 'linear-gradient(135deg, #0080ff 0%, #ff8000 100%)',
        'power-gradient': 'linear-gradient(135deg, #ff3333 0%, #ff8000 100%)',
        'steel-gradient': 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
        'card-gradient': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      },
      fontFamily: {
        'bold': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'fitness': '0 8px 25px -5px rgba(0, 128, 255, 0.3)',
        'power': '0 8px 25px -5px rgba(255, 51, 51, 0.3)',
        'card': '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}

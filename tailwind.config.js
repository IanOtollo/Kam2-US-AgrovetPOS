/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#2C5F2D',
          dark: '#1B3E1C',
        },
        secondary: '#6F4E37',
        accent: {
          DEFAULT: '#D9A441',
          success: '#3E8E41',
          warning: '#E0A62E',
          danger: '#B3382C',
        },
        background: {
          DEFAULT: '#F7F3E9',
          surface: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E3DCC8',
        },
        text: {
          primary: '#1F2A1F',
          muted: '#5C6B5C',
        }
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 1px 3px 0 rgb(0 0 0 / 0.07)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#070707',
          subtle: '#0D0D0D',
          elevated: '#111111',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          muted: '#8A8A8A',
          subtle: '#5A5A5A',
        },
        card: {
          DEFAULT: '#111111',
          hover: '#181818',
        },
        border: {
          DEFAULT: '#242424',
          hover: '#333333',
        },
        primary: {
          DEFAULT: '#E63946',
          hover: '#D62839',
          light: '#FF4D5D',
        },
        accent: {
          DEFAULT: '#E63946',
          hover: '#D62839',
          light: '#FF4D5D',
        },
        danger: {
          DEFAULT: '#E63946',
          hover: '#D62839',
        },
        success: {
          DEFAULT: '#E63946',
          hover: '#D62839',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(230, 57, 70, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(230, 57, 70, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cinematic-glow': 'radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.12), transparent 70%)',
      },
    },
  },
  plugins: [],
};

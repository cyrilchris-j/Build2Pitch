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
          elevated: '#141414',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          muted: '#8A8A8A',
          subtle: '#666666',
        },
        card: {
          DEFAULT: '#111111',
          hover: '#181818',
        },
        border: {
          DEFAULT: '#242424',
          hover: '#383838',
        },
        primary: {
          DEFAULT: '#E63946',
          hover: '#D32F2F',
          light: '#FF6B6B',
        },
        accent: {
          DEFAULT: '#E63946',
          hover: '#D32F2F',
          light: '#FF6B6B',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(230, 57, 70, 0.45)',
        'glow-accent': '0 0 25px -5px rgba(230, 57, 70, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cinematic-glow': 'radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.18), transparent 70%)',
      },
    },
  },
  plugins: [],
};

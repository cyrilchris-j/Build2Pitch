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
          DEFAULT: '#070711',
          subtle: '#0D0D1A',
          elevated: '#0F0F1E',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          muted: '#8A8FA8',
          subtle: '#4A4F65',
        },
        card: {
          DEFAULT: '#0F0F1E',
          hover: '#14142B',
        },
        border: {
          DEFAULT: '#1E1E3A',
          hover: '#2A2A50',
        },
        // Primary: Electric Blue
        primary: {
          DEFAULT: '#00D4FF',
          hover: '#00BFEA',
          light: '#33DDFF',
          dark: '#0099CC',
        },
        // Accent: Cyan
        accent: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          light: '#22D3EE',
        },
        // Purple for hero gradients
        purple: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
        },
        // Status colors
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        // Glow tokens
        glow: {
          blue: 'rgba(0, 212, 255, 0.3)',
          cyan: 'rgba(6, 182, 212, 0.3)',
          purple: 'rgba(124, 58, 237, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(0, 212, 255, 0.4)',
        'glow-accent': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 30px -5px rgba(124, 58, 237, 0.4)',
        'glow-sm': '0 0 15px -3px rgba(0, 212, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        'card': '0 4px 24px 0 rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px 0 rgba(0, 212, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.15), transparent 70%)',
        'purple-glow': 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.12), transparent 70%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scan': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

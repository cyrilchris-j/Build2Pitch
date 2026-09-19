/**
 * BUILD2PITCH Design Tokens
 * Premium cinematic entrepreneurship aesthetic
 */

export const tokens = {
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
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
  },
  shadows: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
  },
} as const;

export type DesignTokens = typeof tokens;

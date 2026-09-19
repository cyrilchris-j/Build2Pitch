/**
 * BUILD2PITCH Design Tokens
 * Premium cinematic entrepreneurship aesthetic
 */

export const tokens = {
  colors: {
    background: {
      DEFAULT: '#090D16',
      subtle: '#0D1424',
      elevated: '#111A2E',
    },
    foreground: {
      DEFAULT: '#F8FAFC',
      muted: '#94A3B8',
      subtle: '#64748B',
    },
    card: {
      DEFAULT: '#0F172A',
      hover: '#131D35',
      glass: 'rgba(15, 23, 42, 0.75)',
    },
    border: {
      DEFAULT: '#1E293B',
      hover: '#334155',
      glow: 'rgba(6, 182, 212, 0.25)',
    },
    primary: {
      DEFAULT: '#06B6D4', // Electric Cyan
      hover: '#0891B2',
      light: '#22D3EE',
      glow: 'rgba(6, 182, 212, 0.35)',
    },
    accent: {
      DEFAULT: '#F59E0B', // Pitch Gold / Warm Amber
      hover: '#D97706',
      light: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.35)',
    },
    danger: {
      DEFAULT: '#EF4444', // Alert Crimson
      hover: '#DC2626',
      subtle: 'rgba(239, 68, 68, 0.15)',
    },
    success: {
      DEFAULT: '#10B981', // Launch Mint
      hover: '#059669',
      subtle: 'rgba(16, 185, 129, 0.15)',
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
    glowCyan: '0 0 25px -5px rgba(6, 182, 212, 0.3)',
    glowAmber: '0 0 25px -5px rgba(245, 158, 11, 0.3)',
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
  },
} as const;

export type DesignTokens = typeof tokens;

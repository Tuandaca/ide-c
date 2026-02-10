// Export CSS tokens
import './tokens.css';

export const theme = {
  colors: {
    bg: {
      primary: 'var(--color-bg-primary)',
      secondary: 'var(--color-bg-secondary)',
      surface: 'var(--color-bg-surface)',
      elevated: 'var(--color-bg-elevated)',
    },
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      muted: 'var(--color-text-muted)',
      inverse: 'var(--color-text-inverse)',
    },
    neon: {
      primary: 'var(--color-neon-primary)',
      bright: 'var(--color-neon-bright)',
      dim: 'var(--color-neon-dim)',
    },
    accent: {
      primary: 'var(--color-accent-primary)',
      hover: 'var(--color-accent-hover)',
      active: 'var(--color-accent-active)',
    },
    semantic: {
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
    },
    border: {
      default: 'var(--color-border-default)',
      subtle: 'var(--color-border-subtle)',
      focus: 'var(--color-border-focus)',
    },
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
  },
  font: {
    mono: 'var(--font-mono)',
    ui: 'var(--font-ui)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  glow: {
    small: 'var(--glow-small)',
    medium: 'var(--glow-medium)',
    large: 'var(--glow-large)',
  },
} as const;

export type Theme = typeof theme;

// Theme utilities
export type ThemeVariant = 'green' | 'red' | 'blue' | 'violet';

export function setTheme(theme: ThemeVariant) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function getTheme(): ThemeVariant {
  const current = document.documentElement.getAttribute('data-theme');
  return (current as ThemeVariant) || 'green';
}

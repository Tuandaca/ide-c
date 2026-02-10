// Export CSS tokens
import './tokens.css';

export const theme = {
  colors: {
    bg: {
      primary: 'var(--color-bg-primary)',
      secondary: 'var(--color-bg-secondary)',
      tertiary: 'var(--color-bg-tertiary)',
      elevated: 'var(--color-bg-elevated)',
    },
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      muted: 'var(--color-text-muted)',
      inverse: 'var(--color-text-inverse)',
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
  },
} as const;

export type Theme = typeof theme;

export const C = {
  bg:       '#0A0D10',
  surface:  '#14181D',
  surface2: '#1B2128',
  ink:      '#EFF2F1',
  muted:    '#8B96A0',
  line:     '#232A31',
  accent:   '#FF5A1F',
  accent2:  '#E84D17',
  teal:     '#36D1C4',
  free:     '#36D1C4',
} as const;

export const FONT = {
  sans: undefined,        // system default
  mono: 'Courier',        // fallback; swap for "RobotoMono" if bundled
} as const;

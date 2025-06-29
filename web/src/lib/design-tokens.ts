// Design system colors based on warm gold palette (#CC9F53) and cream (#F5EFD7) - Elegant artisanal feeling
export const colors = {
  // Primary colors - Warm gold palette based on #CC9F53
  primary: {
    50: '#fefcf7', // Very light cream (#F5EFD7 inspired)
    100: '#fdf8ed', // Light cream
    200: '#f9f0d9', // Soft cream
    300: '#f2e4c0', // Medium cream
    400: '#e8d4a0', // Light gold
    500: '#d4c088', // Medium gold
    600: '#cc9f53', // Main gold (#CC9F53 - brand color)
    700: '#b8874a', // Dark gold
    800: '#9a6f3e', // Darker gold
    900: '#7d5a34', // Deep gold
    950: '#5e4529', // Ultra dark gold
  },

  // Neutral colors - Warm grays that complement gold
  neutral: {
    50: '#fafaf8', // Warm off-white
    100: '#f5f4f1', // Very light warm gray
    200: '#ebe8e3', // Light warm gray
    300: '#ddd8d1', // Medium light warm gray
    400: '#b5aea5', // Medium warm gray
    500: '#8a827a', // Main warm gray
    600: '#6b635c', // Dark warm gray
    700: '#504a45', // Darker warm gray
    800: '#3a352f', // Very dark warm gray
    900: '#2a241f', // Deepest warm gray
    950: '#1a1612', // Ultra dark warm gray
  },

  // Supporting colors - Soft, harmonious with gold
  accent: {
    // Sage green - natural, calming
    sage: {
      50: '#f6f8f3',
      100: '#e9f0e3',
      500: '#7a9471',
      600: '#6b8263',
      700: '#5c7055',
    },
    // Soft terracotta - warm, earthy
    terracotta: {
      50: '#fdf6f3',
      100: '#f9ebe6',
      500: '#c8876d',
      600: '#b8795f',
      700: '#a86b51',
    },
    // Soft lavender - elegant, premium
    lavender: {
      50: '#f7f6fc',
      100: '#efecf8',
      500: '#9b93c4',
      600: '#8b83b6',
      700: '#7b73a8',
    },
  },

  // Semantic colors - Harmonious with the palette
  success: {
    50: '#f6f8f3',
    100: '#e9f0e3',
    500: '#7a9471',
    600: '#6b8263',
    700: '#5c7055',
  },

  error: {
    50: '#fdf6f3',
    100: '#f9ebe6',
    500: '#c8876d',
    600: '#b8795f',
    700: '#a86b51',
  },

  warning: {
    50: '#fefcf7',
    100: '#fdf8ed',
    500: '#cc9f53',
    600: '#b8874a',
    700: '#9a6f3e',
  },

  info: {
    50: '#f7f6fc',
    100: '#efecf8',
    500: '#9b93c4',
    600: '#8b83b6',
    700: '#7b73a8',
  },
};

// Typography scale with elegant serif font for headings
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
};

// Spacing scale
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadows - Soft, warm shadows that complement the gold palette
export const shadows = {
  sm: '0 1px 2px 0 rgb(122 90 52 / 0.05)',
  base: '0 1px 3px 0 rgb(122 90 52 / 0.1), 0 1px 2px -1px rgb(122 90 52 / 0.1)',
  md: '0 4px 6px -1px rgb(122 90 52 / 0.1), 0 2px 4px -2px rgb(122 90 52 / 0.1)',
  lg: '0 10px 15px -3px rgb(122 90 52 / 0.1), 0 4px 6px -4px rgb(122 90 52 / 0.1)',
  xl: '0 20px 25px -5px rgb(122 90 52 / 0.1), 0 8px 10px -6px rgb(122 90 52 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(122 90 52 / 0.25)',
};

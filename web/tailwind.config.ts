import type { Config } from 'tailwindcss';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '64': '16rem',
      },
      colors: {
        primary: {
          50: '#fefcf7',
          100: '#fdf8ed',
          200: '#f9f0d9',
          300: '#f2e4c0',
          400: '#e8d4a0',
          500: '#d4c088',
          600: '#cc9f53',
          700: '#b8874a',
          800: '#9a6f3e',
          900: '#7d5a34',
          950: '#5e4529',
        },
        neutral: {
          50: '#fafaf8',
          100: '#f5f4f1',
          200: '#ebe8e3',
          300: '#ddd8d1',
          400: '#b5aea5',
          500: '#8a827a',
          600: '#6b635c',
          700: '#504a45',
          800: '#3a352f',
          900: '#2a241f',
          950: '#1a1612',
        },
        accent: {
          sage: '#7a9471',
          terracotta: '#c8876d',
          lavender: '#9b93c4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200px 0',
          },
          '100%': {
            backgroundPosition: 'calc(200px + 100%) 0',
          },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [
    scrollbar,
  ],
};

export default config;

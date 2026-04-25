import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#21517C',
          light: '#3671A1',
          dark: '#143553',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#A45C36',
          light: '#C87955',
          dark: '#76361A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F29E4C',
          foreground: '#252422',
        },
        clay: {
          50: '#F5F4F1',
          100: '#ECEBE9',
          200: '#E8E6E2',
          300: '#D6D4CF',
          400: '#7C746B',
          900: '#252422',
        },
        background: {
          DEFAULT: '#F5F4F1',
          alt: '#ECEBE9',
        },
        surface: '#F3EEE9',
        foreground: {
          DEFAULT: '#252422',
          muted: '#7C746B',
        },
        border: {
          DEFAULT: '#D6D4CF',
          light: '#E8E6E2',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#2563EB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.06)',
        md: '0 2px 4px rgba(0, 0, 0, 0.06)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.08)',
        xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#252422',
            '--tw-prose-headings': '#252422',
            '--tw-prose-links': '#21517C',
            '--tw-prose-bold': '#252422',
            '--tw-prose-quotes': '#7C746B',
            '--tw-prose-code': '#A45C36',
            '--tw-prose-borders': '#D6D4CF',
            'a:hover': { color: '#143553' },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;

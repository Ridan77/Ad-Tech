import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Arial', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          500: '#1f7ae0',
          600: '#1669c1',
          700: '#15559b',
          800: '#3c0222'
        },
        surface: {
          base: '#ffffff',
          soft: '#f8fafc',
          card: '#eee8e8'
        },
        stroke: {
          DEFAULT: '#cbd5e1',
          soft: '#e2e8f0'
        },
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        ink: '#0f172a',
        canvas: '#f8fafc'
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 10px 25px -12px rgba(15, 23, 42, 0.25)'
      },
      keyframes: {
        'fade-up': {
          from: {
            opacity: '0',
            transform: 'translateY(5px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        }
      },
      animation: {
        'fade-up': 'fade-up 220ms ease-out',
        'fade-in': 'fade-in 180ms ease-out'
      }
    }
  },
  plugins: []
}

export default config

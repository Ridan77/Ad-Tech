import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          500: '#1f7ae0',
          600: '#1669c1',
          700: '#15559b'
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
      }
    }
  },
  plugins: []
}

export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b',
        },
        accent: { 
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        dark:   { 
          50: '#f9fafb',
          800: '#111827',
          900: '#030712',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-in':  'slideIn 0.5s ease forwards',
        'float':     'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGlow: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.8 } },
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow': '0 0 40px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 80px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
};
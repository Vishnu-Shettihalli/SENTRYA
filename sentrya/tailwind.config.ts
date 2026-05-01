/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#05080f',
        surface: '#0b1120',
        surface2: '#111827',
        surface3: '#1a2236',
        accent: '#00e5ff',
        accent2: '#7c3aed',
        accent3: '#10b981',
        danger: '#ef4444',
        warn: '#f59e0b',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        pulse2: 'pulse2 2s infinite',
        spin: 'spin 0.8s linear infinite',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};

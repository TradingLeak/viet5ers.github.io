import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#030712',
          850: '#050a1a',
          800: '#0c1222',
          700: '#111827',
        },
        accent: {
          DEFAULT: '#00d4aa',
          glow: '#00ffcc',
          dark: '#00a888',
        },
        gold: {
          DEFAULT: '#ffd700',
          glow: '#fff000',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'rotate-in': 'rotateIn 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        rotateIn: { '0%': { opacity: '0', transform: 'rotate(-180deg) scale(0.5)' }, '100%': { opacity: '1', transform: 'rotate(0) scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' }, '50%': { boxShadow: '0 0 60px rgba(0, 212, 170, 0.6)' } },
        orbit: { '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' }, '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #020617 0%, #0c1222 50%, #020617 100%)',
      },
    },
  },
  plugins: [],
};
export default config;

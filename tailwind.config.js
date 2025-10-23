/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode for next-themes
  theme: {
    extend: {
      colors: {
        // Background colors using CSS variables
        bg: {
          primary: 'rgb(var(--bg-primary))',
          secondary: 'rgb(var(--bg-secondary))',
          tertiary: 'rgb(var(--bg-tertiary))',
        },
        // Text colors
        text: {
          primary: 'rgb(var(--text-primary))',
          secondary: 'rgb(var(--text-secondary))',
          muted: 'rgb(var(--text-muted))',
        },
        // Primary colors (Emerald/Green)
        primary: {
          50: 'rgb(var(--primary-50))',
          100: 'rgb(var(--primary-100))',
          200: 'rgb(var(--primary-200))',
          300: 'rgb(var(--primary-300))',
          400: 'rgb(var(--primary-400))',
          500: 'rgb(var(--primary-500))',
          600: 'rgb(var(--primary-600))',
          700: 'rgb(var(--primary-700))',
          800: 'rgb(var(--primary-800))',
          900: 'rgb(var(--primary-900))',
        },
        // Accent colors
        accent: {
          purple: 'rgb(var(--accent-purple))',
          blue: 'rgb(var(--accent-blue))',
          cyan: 'rgb(var(--accent-cyan))',
          amber: 'rgb(var(--accent-amber))',
        },
        // Neon colors for special effects
        neon: {
          green: 'rgb(var(--neon-green))',
          purple: 'rgb(var(--neon-purple))',
          blue: 'rgb(var(--neon-blue))',
          cyan: 'rgb(var(--neon-cyan))',
        },
        // Semantic colors
        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
        error: 'rgb(var(--error))',
        info: 'rgb(var(--info))',
        // Border colors
        border: {
          DEFAULT: 'rgb(var(--border) / 0.2)',
          bright: 'rgb(var(--border-bright) / 0.3)',
        },
        // Legacy support for existing components
        background: 'rgb(var(--bg-primary))',
        foreground: 'rgb(var(--text-primary))',
        card: {
          DEFAULT: 'rgb(var(--bg-secondary))',
          foreground: 'rgb(var(--text-primary))',
        },
        popover: {
          DEFAULT: 'rgb(var(--bg-tertiary))',
          foreground: 'rgb(var(--text-primary))',
        },
        muted: {
          DEFAULT: 'rgb(var(--bg-tertiary))',
          foreground: 'rgb(var(--text-muted))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--error))',
          foreground: 'rgb(var(--text-primary))',
        },
        input: 'rgb(var(--bg-secondary))',
        ring: 'rgb(var(--primary-400))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow': '0 0 25px rgb(var(--primary-400) / 0.4)',
        'glow-strong': '0 0 40px rgb(var(--primary-400) / 0.6)',
        'neon': '0 0 20px rgb(var(--neon-green) / 0.5), 0 0 40px rgb(var(--neon-green) / 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-left': 'fade-in-left 0.8s ease-out',
        'fade-in-right': 'fade-in-right 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgb(var(--primary-400) / 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgb(var(--primary-400) / 0.6)',
            transform: 'scale(1.05)'
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgb(var(--primary-400) / 0.4), 0 0 20px rgb(var(--primary-400) / 0.3), 0 0 30px rgb(var(--primary-400) / 0.2)',
          },
          '50%': {
            boxShadow: '0 0 20px rgb(var(--primary-400) / 0.6), 0 0 30px rgb(var(--primary-400) / 0.5), 0 0 40px rgb(var(--primary-400) / 0.4)',
          },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-left': {
          from: {
            opacity: '0',
            transform: 'translateX(-40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'fade-in-right': {
          from: {
            opacity: '0',
            transform: 'translateX(40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'scale-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
    },
  },
  plugins: [],
}

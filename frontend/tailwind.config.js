/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Slate/Charcoal for enterprise look
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Accent colors (complementary)
        accent: {
          green: {
            light: '#166534',
            DEFAULT: '#15803d',
            dark: '#14532d',
          },
          blue: {
            light: '#1e40af',
            DEFAULT: '#1d4ed8',
            dark: '#1e3a8a',
          },
          orange: {
            light: '#c2410c',
            DEFAULT: '#ea580c',
            dark: '#9a3412',
          },
        },
        // Sidebar dark theme
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#334155',
          border: '#334155',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevated': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

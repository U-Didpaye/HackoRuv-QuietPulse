/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#0A0F1D',
          surface: '#111827',
          card: '#1E293B',
          hover: '#283548',
          border: '#334155',
        },
        shield: {
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          indigo: '#6366F1',
          urgent: '#EF4444',
          important: '#F59E0B',
          batch: '#3B82F6',
          low: '#64748B',
          success: '#10B981',
        }
      }
    },
  },
  plugins: [],
}

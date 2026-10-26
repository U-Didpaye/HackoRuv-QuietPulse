/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'v-bg': 'var(--v-bg)',
        'v-surface': 'var(--v-surface)',
        'v-secondary': 'var(--v-secondary)',
        'v-elevated': 'var(--v-elevated)',
        'v-text': 'var(--v-primary-text)',
        'v-text-muted': 'var(--v-secondary-text)',
        'v-muted': 'var(--v-muted-text)',
        'v-border': 'var(--v-border)',
        'v-border-subtle': 'var(--v-border-subtle)',
        'v-accent': 'var(--v-accent)',
        'v-accent-hover': 'var(--v-accent-hover)',
        'v-badge': 'var(--v-badge-bg)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        editorial: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#2ECC71',   // vitória / check-in
        secondary: '#3498DB', // informação / links
        care: '#E67E22',      // SOS / cuidado
        ink: '#2C3E50',
        muted: '#7F8C8D',
        divider: '#ECF0F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { card: '12px' },
    },
  },
  plugins: [],
}

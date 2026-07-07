/** @type {import('tailwindcss').Config} */
// Tokens v1.1 — "O céu que clareia" (UX). Contraste verificado por script (WCAG AA).
// Correção: primary antigo #2ECC71 tinha 2.10:1 com branco (falhava AA); v1.1 usa #0A7C55 (5.21:1).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#0A7C55',        // ação/vitória — AA c/ branco
        'primary-bright': '#34D08C', // decorativo (nunca texto)
        secondary: '#1D6FA3',      // informação/links — AA c/ branco
        care: '#C2410C',           // SOS/cuidado — AA c/ branco
        ink: '#16323C',
        muted: '#5C7078',
        divider: '#E3EDF1',
        'sky-lo': '#F4F9FB',       // fundo diurno
        'sky-hi': '#CBE7F6',       // topo do céu
        sun: '#FFC24B',            // sol (decorativo)
        'night-lo': '#0B1B22',     // fundo dark
        'night-hi': '#12303F',
      },
      fontFamily: {
        display: ['"Sora Variable"', 'Sora', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '14px' },
      boxShadow: {
        card: '0 1px 2px rgba(22,50,60,0.06), 0 4px 16px rgba(22,50,60,0.06)',
        fab: '0 6px 20px rgba(194,65,12,0.35)',
      },
    },
  },
  plugins: [],
}

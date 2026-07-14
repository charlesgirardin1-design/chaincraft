/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Violet "chaîne" — couleur principale de la marque
        chain: {
          50: '#f2f1fe',
          100: '#e5e3fd',
          200: '#c9c5fb',
          300: '#a29afa',
          400: '#7a6cf5',
          500: '#5b47ec',
          600: '#4832d6',
          700: '#3a27ad',
          800: '#302189',
          900: '#281d6d',
        },
        // Ambre "étincelle" — accent créatif
        spark: {
          50: '#fffaeb',
          100: '#fff0c2',
          200: '#ffe089',
          300: '#ffc94d',
          400: '#ffb020',
          500: '#f79608',
          600: '#d97706',
          700: '#b45a09',
          800: '#92460f',
          900: '#78390f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        cardHover: '0 16px 36px -8px rgba(15,23,42,0.16), 0 4px 10px -4px rgba(15,23,42,0.08)',
        glow: '0 0 0 1px rgba(91,71,236,0.08), 0 8px 24px -8px rgba(91,71,236,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        rise: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.85)' },
          '60%': { opacity: 1, transform: 'scale(1.05)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(24px, -18px) scale(1.06)' },
          '66%': { transform: 'translate(-16px, 14px) scale(0.96)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out both',
        rise: 'rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        popIn: 'popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        blobFloat: 'blobFloat 14s ease-in-out infinite',
        blobFloatSlow: 'blobFloat 20s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        spinSlow: 'spin 6s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

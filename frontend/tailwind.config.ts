import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', '"IBM Plex Sans Thai"', 'sans-serif'],
        thai: ['"IBM Plex Sans Thai"', '"Inter"', 'sans-serif']
      },
      colors: {
        pureWhite: '#FFFFFF',
        softMintBg: '#F7F9F8',
        forestBlack: '#09140E',
        obsidianInk: '#111815',
        mutedSlate: '#526058',
        emeraldCore: '#059669',
        emeraldBright: '#10B981',
        mintGlow: '#34D399'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  }
}

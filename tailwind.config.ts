import type { Config } from 'tailwindcss'

// Direction artistique VERROUILLEE : voir DA-DESIGN-SYSTEM.md section 9.
// Ne pas modifier ces tokens sans mettre a jour la DA.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f6f2e8',
        cream2: '#efe9db',
        paper: '#fffdf8',
        ink: '#1f3350',
        ink2: '#3a4a63',
        muted: '#6a7688',
        blue: { DEFAULT: '#6aa4d8', dark: '#3f77b0', bg: '#e6f0fa' },
        sage: { DEFAULT: '#8bb28a', dark: '#5f8a5e', bg: '#e5efe4' },
        gold: '#e0b64c',
        line: '#e4ddcc',
        sand: '#d9cfb8',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '18px', field: '12px' },
      boxShadow: { soft: '0 8px 30px rgba(31,51,80,0.07)' },
    },
  },
  plugins: [],
}

export default config

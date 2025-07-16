/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      'colors': {
            'background': '#1e1e1e',
            'foreground': '#d4d4d4',
            'sidebar': {
                  'background': '#252526'
            },
            'activityBar': {
                  'background': '#2d2d30'
            },
            'syntax': {
                  'comment': '#6A9955',
                  'string': '#CE9178',
                  'keyword': '#569cd6',
                  'variable': '#9cdcfe',
                  'function': '#dcdcaa',
                  'type': '#4ec9b0',
                  'number': '#b5cea8',
                  'operator': '#d4d4d4'
            }
      }
},
  },
  plugins: [],
}
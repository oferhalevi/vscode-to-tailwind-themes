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
            'cursor': '#aeafad',
            'selection': '#264f78',
            'lineHighlight': '#2a2d2e',
            'sidebar': {
                  'background': '#252526',
                  'foreground': '#cccccc',
                  'title': '#cccccc'
            },
            'activityBar': {
                  'background': '#333333',
                  'foreground': '#ffffff',
                  'active': '#007acc'
            },
            'statusBar': {
                  'background': '#007acc',
                  'foreground': '#ffffff'
            },
            'tab': {
                  'active': '#1e1e1e',
                  'inactive': '#2d2d30',
                  'activeForeground': '#ffffff',
                  'inactiveForeground': '#969696'
            },
            'button': {
                  'primary': '#0e639c',
                  'primaryText': '#ffffff',
                  'primaryHover': '#1177bb'
            },
            'input': {
                  'background': '#3c3c3c',
                  'foreground': '#cccccc',
                  'border': '#3c3c3c'
            },
            'list': {
                  'activeSelection': '#094771',
                  'hover': '#2a2d2e',
                  'focus': '#062f4a'
            },
            'terminal': {
                  'background': '#1e1e1e',
                  'foreground': '#d4d4d4',
                  'black': '#000000',
                  'red': '#cd3131',
                  'green': '#0dbc79',
                  'yellow': '#e5e510',
                  'blue': '#2472c8',
                  'magenta': '#bc3fbc',
                  'cyan': '#11a8cd',
                  'white': '#e5e5e5'
            },
            'syntax': {
                  'comment': '#6A9955',
                  'variable': '#B5CEA8',
                  'string': '#CE9178',
                  'keyword': '#B5CEA8',
                  'type': '#4EC9B0',
                  'function': '#DCDCAA',
                  'number': '#B5CEA8',
                  'constant': '#B5CEA8',
                  'operator': '#d4d4d4'
            }
      }
},
  },
  plugins: [],
}
# VSCode to Tailwind Theme Converter

A powerful tool that converts Visual Studio Code themes into Tailwind CSS theme configurations, making it easy to use your favorite editor themes in your web projects.

## Features

- 🎨 **Complete Color Mapping**: Converts VSCode editor colors, syntax highlighting, and UI elements
- 🔧 **Flexible Configuration**: Supports custom color mappings and conversion options
- 📁 **Multiple Output Formats**: Generate JavaScript or JSON configuration files
- 🎯 **Semantic Token Support**: Includes semantic highlighting colors when available
- 🖥️ **CLI Interface**: Easy-to-use command-line tool
- 📊 **Theme Analysis**: Analyze VSCode themes to see available colors
- ✅ **TypeScript Support**: Fully typed for better development experience

## Installation

```bash
npm install vscode-to-tailwind-themes
# or
yarn add vscode-to-tailwind-themes
```

## Quick Start

### CLI Usage

Convert a VSCode theme to Tailwind CSS:

```bash
# Basic conversion
npx vscode-to-tailwind convert path/to/theme.json

# Specify output file and format
npx vscode-to-tailwind convert theme.json -o tailwind.config.js -f js

# Preserve original VSCode color names
npx vscode-to-tailwind convert theme.json --preserve-names

# Exclude semantic token colors
npx vscode-to-tailwind convert theme.json --no-semantic
```

Analyze a theme file:

```bash
# Show basic theme information
npx vscode-to-tailwind analyze theme.json

# Include token color details
npx vscode-to-tailwind analyze theme.json --show-tokens
```

List available color mappings:

```bash
npx vscode-to-tailwind list-mappings
```

### Programmatic Usage

```typescript
import { ThemeConverter } from 'vscode-to-tailwind-themes';

const converter = new ThemeConverter({
  includeSemanticColors: true,
  preserveOriginalNames: false,
  outputFormat: 'js'
});

// Convert a theme file
const config = await converter.convertThemeFile(
  './dark-plus.json',
  './tailwind.config.js'
);

// Or convert a theme object directly
const vscodeTheme = { /* VSCode theme object */ };
const tailwindConfig = converter.convertTheme(vscodeTheme);
```

## Color Mapping

The converter maps VSCode theme colors to a structured Tailwind CSS configuration:

### Editor Colors
- `editor.background` → `colors.background`
- `editor.foreground` → `colors.foreground`
- `editorCursor.foreground` → `colors.cursor`
- `editor.selectionBackground` → `colors.selection`

### UI Elements
- `sideBar.background` → `colors.sidebar.background`
- `statusBar.background` → `colors.statusBar.background`
- `button.background` → `colors.button.primary`
- `tab.activeBackground` → `colors.tab.active`

### Syntax Highlighting
- Keywords → `colors.syntax.keyword`
- Strings → `colors.syntax.string`
- Comments → `colors.syntax.comment`
- Variables → `colors.syntax.variable`
- Functions → `colors.syntax.function`
- Types → `colors.syntax.type`

### Terminal Colors
- `terminal.ansiRed` → `colors.terminal.red`
- `terminal.ansiGreen` → `colors.terminal.green`
- And all other ANSI colors...

## Configuration Options

```typescript
interface ConversionOptions {
  includeSemanticColors?: boolean;    // Include semantic token colors (default: true)
  customMappings?: ColorMapping[];    // Custom color mappings
  outputFormat?: 'js' | 'json';      // Output format (default: 'js')
  preserveOriginalNames?: boolean;    // Keep original VSCode color names (default: false)
}
```

## Custom Mappings

Create custom color mappings by providing a JSON file:

```json
[
  {
    "vscodeKey": "custom.color",
    "tailwindPath": "colors.custom.primary",
    "description": "Custom primary color"
  }
]
```

Use with CLI:

```bash
npx vscode-to-tailwind convert theme.json --custom-mappings mappings.json
```

## Example Output

Given a VSCode theme, the converter generates a Tailwind configuration like:

```javascript
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
      colors: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#aeafad',
        selection: '#264f78',
        sidebar: {
          background: '#252526',
          foreground: '#cccccc'
        },
        syntax: {
          keyword: '#569cd6',
          string: '#ce9178',
          comment: '#6a9955',
          variable: '#9cdcfe',
          function: '#dcdcaa',
          type: '#4ec9b0'
        },
        terminal: {
          red: '#cd3131',
          green: '#0dbc79',
          blue: '#2472c8'
        }
      }
    }
  },
  plugins: [],
}
```

## Finding VSCode Themes

VSCode themes are typically located in:

- **Built-in themes**: VSCode installation directory
- **Extensions**: `~/.vscode/extensions/*/themes/`
- **Custom themes**: User settings directory

You can also download themes from:
- [VSCode Marketplace](https://marketplace.visualstudio.com/search?target=VSCode&category=Themes)
- [GitHub repositories](https://github.com/topics/vscode-theme)

## API Reference

### ThemeConverter

The main class for converting themes.

#### Constructor

```typescript
new ThemeConverter(options?: ConversionOptions)
```

#### Methods

- `convertTheme(vscodeTheme: VSCodeTheme): TailwindConfig`
- `convertThemeFile(inputPath: string, outputPath?: string): Promise<TailwindConfig>`

### Utility Functions

- `isValidHexColor(color: string): boolean`
- `normalizeColor(color: string): string`
- `generateTailwindColorName(vscodeKey: string): string`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0
- Initial release
- Basic VSCode to Tailwind conversion
- CLI interface
- TypeScript support
- Comprehensive color mapping
- Custom mappings support
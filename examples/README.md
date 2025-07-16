# VSCode to Tailwind Theme Converter Examples

This directory contains example VSCode themes and generated Tailwind configurations to demonstrate the converter functionality.

## Example Themes

### Dark+ Theme (`dark-plus.json`)
The default dark theme from VSCode, featuring:
- Dark editor background (#1e1e1e)
- Blue accent colors for UI elements
- Comprehensive syntax highlighting colors

### Monokai Theme (`monokai.json`)
A popular dark theme with vibrant colors:
- Dark green editor background (#272822)
- Bright accent colors (pink, green, blue, purple)
- High contrast syntax highlighting

## Generated Configurations

After running the converter, you'll find:
- `tailwind.config.js` - JavaScript format configuration
- `*.config.json` - JSON format configurations (when using `-f json`)

## Usage Examples

```bash
# Convert Dark+ theme
npm run dev convert examples/dark-plus.json -o examples/dark-plus.config.js

# Convert Monokai theme to JSON format
npm run dev convert examples/monokai.json -o examples/monokai.config.json -f json

# Use custom mappings
npm run dev convert examples/dark-plus.json --custom-mappings examples/custom-mappings.json

# Preserve original VSCode color names
npm run dev convert examples/monokai.json --preserve-names

# Analyze a theme
npm run dev analyze examples/dark-plus.json --show-tokens
```

## Custom Mappings

The `custom-mappings.json` file shows how to define additional color mappings beyond the default set. You can create your own mappings to include specific VSCode colors that aren't covered by the default mappings.
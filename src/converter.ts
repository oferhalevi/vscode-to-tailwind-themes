import * as fs from 'fs';
import * as path from 'path';
import { VSCodeTheme, TailwindConfig, ConversionOptions, TokenColor } from './types';
import { DEFAULT_COLOR_MAPPINGS, SYNTAX_SCOPE_MAPPINGS } from './mappings';
import { 
  isValidHexColor, 
  normalizeColor, 
  setNestedProperty, 
  generateTailwindColorName,
  deepMerge,
  isValidUrl,
  fetchUrlContent
} from './utils';

export class ThemeConverter {
  private options: ConversionOptions;

  constructor(options: ConversionOptions = {}) {
    this.options = {
      includeSemanticColors: true,
      customMappings: [],
      outputFormat: 'js',
      preserveOriginalNames: false,
      ...options
    };
  }

  /**
   * Converts a VSCode theme file or URL to Tailwind CSS configuration
   */
  async convertThemeFile(inputPath: string, outputPath?: string): Promise<TailwindConfig> {
    const themeContent = await this.readThemeFile(inputPath);
    const tailwindConfig = this.convertTheme(themeContent);
    
    if (outputPath) {
      await this.writeConfig(tailwindConfig, outputPath);
    }
    
    return tailwindConfig;
  }

  /**
   * Converts a VSCode theme object to Tailwind CSS configuration
   */
  convertTheme(vscodeTheme: VSCodeTheme): TailwindConfig {
    const tailwindTheme: any = {
      colors: {}
    };

    // Convert basic colors from the colors object
    if (vscodeTheme.colors) {
      this.convertBasicColors(vscodeTheme.colors, tailwindTheme);
    }

    // Convert syntax highlighting colors from tokenColors
    if (vscodeTheme.tokenColors) {
      this.convertSyntaxColors(vscodeTheme.tokenColors, tailwindTheme);
    }

    // Convert semantic token colors if enabled
    if (this.options.includeSemanticColors && vscodeTheme.semanticTokenColors) {
      this.convertSemanticColors(vscodeTheme.semanticTokenColors, tailwindTheme);
    }

    // Apply custom mappings
    if (this.options.customMappings) {
      this.applyCustomMappings(vscodeTheme, tailwindTheme);
    }

    return {
      theme: {
        extend: tailwindTheme
      }
    };
  }

  /**
   * Reads and parses a VSCode theme file or fetches from URL
   */
  private async readThemeFile(input: string): Promise<VSCodeTheme> {
    try {
      let content: string;
      
      if (isValidUrl(input)) {
        // Fetch content from URL
        content = await fetchUrlContent(input);
      } else {
        // Read from local file
        content = await fs.promises.readFile(input, 'utf-8');
      }
      
      // Clean up the JSON content for VSCode themes
      let cleanContent = this.cleanVSCodeThemeJson(content);
      
      return JSON.parse(cleanContent);
    } catch (error) {
      const source = isValidUrl(input) ? 'URL' : 'file';
      throw new Error(`Failed to read theme ${source}: ${error}`);
    }
  }

  /**
   * Cleans VSCode theme JSON content to make it parseable
   */
  private cleanVSCodeThemeJson(content: string): string {
    let cleaned = content;
    
    // Remove JSON comments (both single line and multi-line)
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    cleaned = cleaned.replace(/\/\/.*$/gm, '');
    
    // Remove trailing commas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    
    // Handle special characters in string values (like the schema URL)
    // Replace problematic characters in string values
    cleaned = cleaned.replace(/"([^"]*[\x00-\x1F][^"]*)"/g, (match: string, content: string) => {
      return '"' + content.replace(/[\x00-\x1F]/g, '') + '"';
    });
    
    return cleaned;
  }

  /**
   * Converts basic VSCode colors to Tailwind colors
   */
  private convertBasicColors(vscodeColors: Record<string, string>, tailwindTheme: any): void {
    const allMappings = [...DEFAULT_COLOR_MAPPINGS, ...(this.options.customMappings || [])];
    
    for (const mapping of allMappings) {
      const vscodeColor = vscodeColors[mapping.vscodeKey];
      if (vscodeColor && isValidHexColor(vscodeColor)) {
        const normalizedColor = normalizeColor(vscodeColor);
        setNestedProperty(tailwindTheme, mapping.tailwindPath, normalizedColor);
      }
    }

    // If preserveOriginalNames is enabled, also add colors with their original VSCode names
    if (this.options.preserveOriginalNames) {
      for (const [key, value] of Object.entries(vscodeColors)) {
        if (isValidHexColor(value)) {
          const tailwindKey = generateTailwindColorName(key);
          tailwindTheme.colors[tailwindKey] = normalizeColor(value);
        }
      }
    }
  }

  /**
   * Converts syntax highlighting colors from tokenColors
   */
  private convertSyntaxColors(tokenColors: TokenColor[], tailwindTheme: any): void {
    const syntaxColors: Record<string, string> = {};

    for (const tokenColor of tokenColors) {
      if (!tokenColor.scope || !tokenColor.settings.foreground) {
        continue;
      }

      const scopes = Array.isArray(tokenColor.scope) ? tokenColor.scope : [tokenColor.scope];
      const color = normalizeColor(tokenColor.settings.foreground);

      if (!isValidHexColor(color)) {
        continue;
      }

      for (const scope of scopes) {
        // Try to match scope to our predefined mappings
        for (const [scopePattern, tailwindPath] of Object.entries(SYNTAX_SCOPE_MAPPINGS)) {
          if (scope.includes(scopePattern)) {
            setNestedProperty(tailwindTheme, tailwindPath, color);
            syntaxColors[scopePattern] = color;
            break;
          }
        }
      }
    }

    // Set default syntax colors if not found
    this.setDefaultSyntaxColors(tailwindTheme, syntaxColors);
  }

  /**
   * Sets default syntax colors for common elements
   */
  private setDefaultSyntaxColors(tailwindTheme: any, foundColors: Record<string, string>): void {
    const defaults = {
      'colors.syntax.keyword': foundColors['keyword'] || '#569cd6',
      'colors.syntax.string': foundColors['string'] || '#ce9178',
      'colors.syntax.comment': foundColors['comment'] || '#6a9955',
      'colors.syntax.variable': foundColors['variable'] || '#9cdcfe',
      'colors.syntax.function': foundColors['function'] || '#dcdcaa',
      'colors.syntax.type': foundColors['type'] || '#4ec9b0',
      'colors.syntax.number': foundColors['number'] || '#b5cea8',
      'colors.syntax.operator': foundColors['operator'] || '#d4d4d4',
    };

    for (const [path, defaultColor] of Object.entries(defaults)) {
      if (!this.getNestedProperty(tailwindTheme, path)) {
        setNestedProperty(tailwindTheme, path, defaultColor);
      }
    }
  }

  /**
   * Converts semantic token colors
   */
  private convertSemanticColors(semanticColors: Record<string, string | any>, tailwindTheme: any): void {
    for (const [key, value] of Object.entries(semanticColors)) {
      const color = typeof value === 'string' ? value : value.foreground;
      if (color && isValidHexColor(color)) {
        const tailwindKey = generateTailwindColorName(key);
        tailwindTheme.colors[`semantic-${tailwindKey}`] = normalizeColor(color);
      }
    }
  }

  /**
   * Applies custom color mappings
   */
  private applyCustomMappings(vscodeTheme: VSCodeTheme, tailwindTheme: any): void {
    if (!this.options.customMappings) return;

    for (const mapping of this.options.customMappings) {
      const vscodeColor = vscodeTheme.colors?.[mapping.vscodeKey];
      if (vscodeColor && isValidHexColor(vscodeColor)) {
        setNestedProperty(tailwindTheme, mapping.tailwindPath, normalizeColor(vscodeColor));
      }
    }
  }

  /**
   * Writes the Tailwind configuration to a file
   */
  private async writeConfig(config: TailwindConfig, outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    await fs.promises.mkdir(dir, { recursive: true });

    let content: string;
    
    if (this.options.outputFormat === 'json') {
      content = JSON.stringify(config, null, 2);
    } else {
      content = this.generateJSConfig(config);
    }

    await fs.promises.writeFile(outputPath, content, 'utf-8');
  }

  /**
   * Generates JavaScript configuration file content
   */
  private generateJSConfig(config: TailwindConfig): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: ${JSON.stringify(config.theme.extend, null, 6).replace(/"/g, "'")},
  },
  plugins: [],
}`;
  }

  /**
   * Helper method to get nested property (same as utils but for internal use)
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }
}
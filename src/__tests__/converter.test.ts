import { ThemeConverter } from '../converter';
import { VSCodeTheme, ConversionOptions } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('ThemeConverter', () => {
  let converter: ThemeConverter;
  const testTheme: VSCodeTheme = {
    name: 'Test Theme',
    type: 'dark',
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'sideBar.background': '#252526',
      'statusBar.background': '#007acc',
      'button.background': '#0e639c',
      'terminal.ansiRed': '#f14c4c',
      'terminal.ansiGreen': '#23d18b'
    },
    tokenColors: [
      {
        name: 'Keywords',
        scope: ['keyword', 'keyword.control'],
        settings: {
          foreground: '#569cd6'
        }
      },
      {
        name: 'Strings',
        scope: 'string',
        settings: {
          foreground: '#ce9178'
        }
      }
    ]
  };

  beforeEach(() => {
    converter = new ThemeConverter();
  });

  describe('convertTheme', () => {
    it('should convert basic VSCode theme to Tailwind config', () => {
      const result = converter.convertTheme(testTheme);
      
      expect(result).toHaveProperty('theme.extend');
      expect(result.theme.extend).toHaveProperty('colors');
    });

    it('should map editor colors correctly', () => {
      const result = converter.convertTheme(testTheme);
      
      expect(result.theme.extend.colors.background).toBe('#1e1e1e');
      expect(result.theme.extend.colors.foreground).toBe('#d4d4d4');
    });

    it('should map nested colors correctly', () => {
      const result = converter.convertTheme(testTheme);
      
      expect(result.theme.extend.colors.sidebar.background).toBe('#252526');
      expect(result.theme.extend.colors.statusBar.background).toBe('#007acc');
    });

    it('should convert syntax highlighting colors', () => {
      const result = converter.convertTheme(testTheme);
      
      expect(result.theme.extend.colors.syntax.keyword).toBe('#569cd6');
      expect(result.theme.extend.colors.syntax.string).toBe('#ce9178');
    });

    it('should handle terminal colors', () => {
      const result = converter.convertTheme(testTheme);
      
      expect(result.theme.extend.colors.terminal.red).toBe('#f14c4c');
      expect(result.theme.extend.colors.terminal.green).toBe('#23d18b');
    });
  });

  describe('with options', () => {
    it('should preserve original names when enabled', () => {
      const options: ConversionOptions = {
        preserveOriginalNames: true
      };
      converter = new ThemeConverter(options);
      
      const result = converter.convertTheme(testTheme);
      
      expect(result.theme.extend.colors['editor-background']).toBe('#1e1e1e');
      expect(result.theme.extend.colors['side-bar-background']).toBe('#252526');
    });

    it('should exclude semantic colors when disabled', () => {
      const themeWithSemantic: VSCodeTheme = {
        ...testTheme,
        semanticTokenColors: {
          'variable.readonly': '#4fc1ff'
        }
      };
      
      const options: ConversionOptions = {
        includeSemanticColors: false
      };
      converter = new ThemeConverter(options);
      
      const result = converter.convertTheme(themeWithSemantic);
      
      expect(result.theme.extend.colors['semantic-variable-readonly']).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty theme', () => {
      const emptyTheme: VSCodeTheme = {};
      const result = converter.convertTheme(emptyTheme);
      
      expect(result).toHaveProperty('theme.extend');
      expect(result.theme.extend).toHaveProperty('colors');
    });

    it('should handle invalid colors', () => {
      const themeWithInvalidColors: VSCodeTheme = {
        colors: {
          'editor.background': 'invalid-color',
          'editor.foreground': '#d4d4d4'
        }
      };
      
      const result = converter.convertTheme(themeWithInvalidColors);
      
      expect(result.theme.extend.colors.background).toBeUndefined();
      expect(result.theme.extend.colors.foreground).toBe('#d4d4d4');
    });

    it('should normalize colors with alpha channels', () => {
      const themeWithAlpha: VSCodeTheme = {
        colors: {
          'editor.background': '#1e1e1e80'
        }
      };
      
      const result = converter.convertTheme(themeWithAlpha);
      
      expect(result.theme.extend.colors.background).toBe('#1e1e1e');
    });
  });
});
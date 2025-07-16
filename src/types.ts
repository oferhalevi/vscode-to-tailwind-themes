// Types for VSCode theme structure
export interface VSCodeTheme {
  name?: string;
  type?: 'dark' | 'light' | 'hc-black' | 'hc-light';
  colors?: Record<string, string>;
  tokenColors?: TokenColor[];
  semanticHighlighting?: boolean;
  semanticTokenColors?: Record<string, string | TokenStyle>;
}

export interface TokenColor {
  name?: string;
  scope?: string | string[];
  settings: TokenStyle;
}

export interface TokenStyle {
  foreground?: string;
  background?: string;
  fontStyle?: string;
}

// Types for Tailwind theme structure
export interface TailwindTheme {
  colors: Record<string, any>;
  backgroundColor?: Record<string, string>;
  textColor?: Record<string, string>;
  borderColor?: Record<string, string>;
}

export interface TailwindConfig {
  theme: {
    extend: TailwindTheme;
  };
}

// Color mapping interface
export interface ColorMapping {
  vscodeKey: string;
  tailwindPath: string;
  description: string;
}

// Conversion options
export interface ConversionOptions {
  includeSemanticColors?: boolean;
  customMappings?: ColorMapping[];
  outputFormat?: 'js' | 'json';
  preserveOriginalNames?: boolean;
}
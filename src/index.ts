export { ThemeConverter } from './converter';
export { 
  VSCodeTheme, 
  TailwindTheme, 
  TailwindConfig, 
  ConversionOptions,
  ColorMapping,
  TokenColor,
  TokenStyle 
} from './types';
export { DEFAULT_COLOR_MAPPINGS, SYNTAX_SCOPE_MAPPINGS } from './mappings';
export { 
  isValidHexColor,
  hexToRgb,
  rgbToHex,
  normalizeColor,
  setNestedProperty,
  getNestedProperty,
  toReadableName,
  generateTailwindColorName,
  deepMerge
} from './utils';
import { ColorMapping } from './types';

// Default mapping from VSCode theme colors to Tailwind CSS colors
export const DEFAULT_COLOR_MAPPINGS: ColorMapping[] = [
  // Editor colors
  { vscodeKey: 'editor.background', tailwindPath: 'colors.background', description: 'Editor background' },
  { vscodeKey: 'editor.foreground', tailwindPath: 'colors.foreground', description: 'Editor text color' },
  { vscodeKey: 'editorCursor.foreground', tailwindPath: 'colors.cursor', description: 'Cursor color' },
  { vscodeKey: 'editor.selectionBackground', tailwindPath: 'colors.selection', description: 'Selection background' },
  { vscodeKey: 'editor.lineHighlightBackground', tailwindPath: 'colors.lineHighlight', description: 'Current line highlight' },
  
  // Sidebar colors
  { vscodeKey: 'sideBar.background', tailwindPath: 'colors.sidebar.background', description: 'Sidebar background' },
  { vscodeKey: 'sideBar.foreground', tailwindPath: 'colors.sidebar.foreground', description: 'Sidebar text' },
  { vscodeKey: 'sideBarTitle.foreground', tailwindPath: 'colors.sidebar.title', description: 'Sidebar title' },
  
  // Activity bar colors
  { vscodeKey: 'activityBar.background', tailwindPath: 'colors.activityBar.background', description: 'Activity bar background' },
  { vscodeKey: 'activityBar.foreground', tailwindPath: 'colors.activityBar.foreground', description: 'Activity bar icons' },
  { vscodeKey: 'activityBar.activeBorder', tailwindPath: 'colors.activityBar.active', description: 'Active activity bar item' },
  
  // Status bar colors
  { vscodeKey: 'statusBar.background', tailwindPath: 'colors.statusBar.background', description: 'Status bar background' },
  { vscodeKey: 'statusBar.foreground', tailwindPath: 'colors.statusBar.foreground', description: 'Status bar text' },
  
  // Tab colors
  { vscodeKey: 'tab.activeBackground', tailwindPath: 'colors.tab.active', description: 'Active tab background' },
  { vscodeKey: 'tab.inactiveBackground', tailwindPath: 'colors.tab.inactive', description: 'Inactive tab background' },
  { vscodeKey: 'tab.activeForeground', tailwindPath: 'colors.tab.activeForeground', description: 'Active tab text' },
  { vscodeKey: 'tab.inactiveForeground', tailwindPath: 'colors.tab.inactiveForeground', description: 'Inactive tab text' },
  
  // Button colors
  { vscodeKey: 'button.background', tailwindPath: 'colors.button.primary', description: 'Primary button background' },
  { vscodeKey: 'button.foreground', tailwindPath: 'colors.button.primaryText', description: 'Primary button text' },
  { vscodeKey: 'button.hoverBackground', tailwindPath: 'colors.button.primaryHover', description: 'Primary button hover' },
  
  // Input colors
  { vscodeKey: 'input.background', tailwindPath: 'colors.input.background', description: 'Input background' },
  { vscodeKey: 'input.foreground', tailwindPath: 'colors.input.foreground', description: 'Input text' },
  { vscodeKey: 'input.border', tailwindPath: 'colors.input.border', description: 'Input border' },
  
  // List colors
  { vscodeKey: 'list.activeSelectionBackground', tailwindPath: 'colors.list.activeSelection', description: 'Active list item' },
  { vscodeKey: 'list.hoverBackground', tailwindPath: 'colors.list.hover', description: 'List item hover' },
  { vscodeKey: 'list.focusBackground', tailwindPath: 'colors.list.focus', description: 'Focused list item' },
  
  // Terminal colors
  { vscodeKey: 'terminal.background', tailwindPath: 'colors.terminal.background', description: 'Terminal background' },
  { vscodeKey: 'terminal.foreground', tailwindPath: 'colors.terminal.foreground', description: 'Terminal text' },
  { vscodeKey: 'terminal.ansiBlack', tailwindPath: 'colors.terminal.black', description: 'Terminal black' },
  { vscodeKey: 'terminal.ansiRed', tailwindPath: 'colors.terminal.red', description: 'Terminal red' },
  { vscodeKey: 'terminal.ansiGreen', tailwindPath: 'colors.terminal.green', description: 'Terminal green' },
  { vscodeKey: 'terminal.ansiYellow', tailwindPath: 'colors.terminal.yellow', description: 'Terminal yellow' },
  { vscodeKey: 'terminal.ansiBlue', tailwindPath: 'colors.terminal.blue', description: 'Terminal blue' },
  { vscodeKey: 'terminal.ansiMagenta', tailwindPath: 'colors.terminal.magenta', description: 'Terminal magenta' },
  { vscodeKey: 'terminal.ansiCyan', tailwindPath: 'colors.terminal.cyan', description: 'Terminal cyan' },
  { vscodeKey: 'terminal.ansiWhite', tailwindPath: 'colors.terminal.white', description: 'Terminal white' },
  
  // Syntax highlighting colors (from tokenColors)
  { vscodeKey: 'keyword', tailwindPath: 'colors.syntax.keyword', description: 'Keywords' },
  { vscodeKey: 'string', tailwindPath: 'colors.syntax.string', description: 'Strings' },
  { vscodeKey: 'comment', tailwindPath: 'colors.syntax.comment', description: 'Comments' },
  { vscodeKey: 'variable', tailwindPath: 'colors.syntax.variable', description: 'Variables' },
  { vscodeKey: 'function', tailwindPath: 'colors.syntax.function', description: 'Functions' },
  { vscodeKey: 'type', tailwindPath: 'colors.syntax.type', description: 'Types' },
  { vscodeKey: 'number', tailwindPath: 'colors.syntax.number', description: 'Numbers' },
  { vscodeKey: 'operator', tailwindPath: 'colors.syntax.operator', description: 'Operators' },
];

// Common scope patterns for syntax highlighting
export const SYNTAX_SCOPE_MAPPINGS: Record<string, string> = {
  'keyword': 'colors.syntax.keyword',
  'keyword.control': 'colors.syntax.keyword',
  'keyword.operator': 'colors.syntax.operator',
  'string': 'colors.syntax.string',
  'string.quoted': 'colors.syntax.string',
  'comment': 'colors.syntax.comment',
  'comment.line': 'colors.syntax.comment',
  'comment.block': 'colors.syntax.comment',
  'variable': 'colors.syntax.variable',
  'variable.parameter': 'colors.syntax.variable',
  'entity.name.function': 'colors.syntax.function',
  'entity.name.type': 'colors.syntax.type',
  'entity.name.class': 'colors.syntax.type',
  'constant.numeric': 'colors.syntax.number',
  'constant.language': 'colors.syntax.constant',
  'support.function': 'colors.syntax.function',
  'support.type': 'colors.syntax.type',
  'storage.type': 'colors.syntax.type',
  'storage.modifier': 'colors.syntax.keyword',
};
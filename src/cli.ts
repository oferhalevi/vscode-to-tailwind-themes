#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { ThemeConverter } from './converter';
import { ConversionOptions } from './types';
import { isValidUrl } from './utils';

const program = new Command();

program
  .name('vscode-to-tailwind')
  .description('Convert VSCode themes to Tailwind CSS configurations')
  .version('1.0.0');

program
  .command('convert')
  .description('Convert a VSCode theme file or URL to Tailwind CSS configuration')
  .argument('<input>', 'Path to VSCode theme JSON file or URL to theme file')
  .option('-o, --output <path>', 'Output file path (default: tailwind.config.js)')
  .option('-f, --format <format>', 'Output format: js or json', 'js')
  .option('--no-semantic', 'Exclude semantic token colors')
  .option('--preserve-names', 'Preserve original VSCode color names')
  .option('--custom-mappings <path>', 'Path to custom mappings JSON file')
  .action(async (input: string, options: any) => {
    try {
      console.log(chalk.blue('🎨 Converting VSCode theme to Tailwind CSS...'));
      
      // Validate input (file or URL)
      if (!isValidUrl(input) && !fs.existsSync(input)) {
        console.error(chalk.red(`❌ Input file not found and not a valid URL: ${input}`));
        process.exit(1);
      }

      // Show source type
      const sourceType = isValidUrl(input) ? 'URL' : 'file';
      console.log(chalk.gray(`📍 Source: ${sourceType} - ${input}`));

      // Prepare conversion options
      const conversionOptions: ConversionOptions = {
        includeSemanticColors: options.semantic !== false,
        outputFormat: options.format,
        preserveOriginalNames: options.preserveNames,
      };

      // Load custom mappings if provided
      if (options.customMappings) {
        if (!fs.existsSync(options.customMappings)) {
          console.error(chalk.red(`❌ Custom mappings file not found: ${options.customMappings}`));
          process.exit(1);
        }
        const customMappings = JSON.parse(fs.readFileSync(options.customMappings, 'utf-8'));
        conversionOptions.customMappings = customMappings;
      }

      // Determine output path
      const outputPath = options.output || `tailwind.config.${options.format === 'json' ? 'json' : 'js'}`;

      // Convert theme
      const converter = new ThemeConverter(conversionOptions);
      const config = await converter.convertThemeFile(input, outputPath);

      console.log(chalk.green('✅ Theme converted successfully!'));
      console.log(chalk.gray(`📁 Output: ${path.resolve(outputPath)}`));
      
      // Display some statistics
      const colorCount = countColors(config.theme.extend);
      console.log(chalk.cyan(`🎨 Generated ${colorCount} color definitions`));

    } catch (error) {
      console.error(chalk.red('❌ Conversion failed:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze a VSCode theme file or URL and show available colors')
  .argument('<input>', 'Path to VSCode theme JSON file or URL to theme file')
  .option('--show-tokens', 'Show token color information')
  .action(async (input: string, options: any) => {
    try {
      // Validate input (file or URL)
      if (!isValidUrl(input) && !fs.existsSync(input)) {
        console.error(chalk.red(`❌ Input file not found and not a valid URL: ${input}`));
        process.exit(1);
      }

      console.log(chalk.blue('🔍 Analyzing VSCode theme...'));
      
      // Show source type
      const sourceType = isValidUrl(input) ? 'URL' : 'file';
      console.log(chalk.gray(`📍 Source: ${sourceType} - ${input}`));
      
      let themeContent;
      if (isValidUrl(input)) {
        // Fetch and clean the theme content
        const { fetchUrlContent } = require('./utils');
        const content = await fetchUrlContent(input);
        
        // Clean the JSON content (same logic as converter)
        let cleaned = content;
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
        cleaned = cleaned.replace(/\/\/.*$/gm, '');
        cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
        cleaned = cleaned.replace(/"([^"]*[\x00-\x1F][^"]*)"/g, (match: string, content: string) => {
          return '"' + content.replace(/[\x00-\x1F]/g, '') + '"';
        });
        
        themeContent = JSON.parse(cleaned);
      } else {
        themeContent = JSON.parse(fs.readFileSync(input, 'utf-8'));
      }
      
      console.log(chalk.green(`\n📋 Theme Information:`));
      console.log(`  Name: ${chalk.cyan(themeContent.name || 'Unknown')}`);
      console.log(`  Type: ${chalk.cyan(themeContent.type || 'Unknown')}`);
      
      if (themeContent.colors) {
        console.log(`\n🎨 Available Colors (${Object.keys(themeContent.colors).length}):`);
        Object.entries(themeContent.colors).forEach(([key, value]) => {
          console.log(`  ${chalk.gray(key)}: ${chalk.hex(value as string)(value as string)}`);
        });
      }

      if (options.showTokens && themeContent.tokenColors) {
        console.log(`\n🔤 Token Colors (${themeContent.tokenColors.length}):`);
        themeContent.tokenColors.forEach((token: any, index: number) => {
          if (token.settings.foreground) {
            console.log(`  ${index + 1}. ${chalk.gray(token.name || 'Unnamed')}`);
            console.log(`     Scope: ${chalk.cyan(Array.isArray(token.scope) ? token.scope.join(', ') : token.scope || 'None')}`);
            console.log(`     Color: ${chalk.hex(token.settings.foreground)(token.settings.foreground)}`);
          }
        });
      }

    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('list-mappings')
  .description('List all default color mappings')
  .action(() => {
    console.log(chalk.blue('📋 Default Color Mappings:'));
    console.log(chalk.gray('VSCode Color → Tailwind Path'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const { DEFAULT_COLOR_MAPPINGS } = require('./mappings');
    
    DEFAULT_COLOR_MAPPINGS.forEach((mapping: any) => {
      console.log(`${chalk.cyan(mapping.vscodeKey.padEnd(30))} → ${chalk.green(mapping.tailwindPath)}`);
      console.log(`${chalk.gray(' '.repeat(32) + mapping.description)}`);
    });
  });

function countColors(obj: any): number {
  let count = 0;
  
  function traverse(current: any) {
    if (typeof current === 'string' && current.startsWith('#')) {
      count++;
    } else if (typeof current === 'object' && current !== null) {
      Object.values(current).forEach(traverse);
    }
  }
  
  traverse(obj);
  return count;
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

program.parse();
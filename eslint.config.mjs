import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

function cleanGlobals(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.trim(), value]),
  );
}

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'plugin:unicorn/recommended',
      'prettier',
      'prettier/prettier',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        ...cleanGlobals(globals.mocha),
        'vitest/globals': true,
      },
    },
  })),
  {
    files: ['**/*.ts', '**/*.test.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      import: fixupPluginRules(_import),
      prettier: fixupPluginRules(prettier),
      sonarjs,
      unicorn: fixupPluginRules(unicornPlugin),
      vitest: fixupConfigRules(vitestPlugin),
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'unicorn/import-style': [
        'error',
        {
          styles: {
            util: false,
            path: {
              named: true,
            },
          },
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true,
          },
        },
      ],
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],
      'no-empty-function': [
        'error',
        {
          allow: ['constructors'],
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],
      'no-param-reassign': ['error'],
      'no-shadow': 'error',
      'no-unused-vars': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-console': 'warn',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'throw'],
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      camelcase: 'warn',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sonarjs/no-duplicate-string': 'off',
      'import/no-duplicates': 'error',

      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@/*'],
        },
      ],
      indent: [
        'error',
        2,
        {
          MemberExpression: 1,

          ignoredNodes: [
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
          ],
        },
      ],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'prettier/prettier': ['error'],
    },
  },
];

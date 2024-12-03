/// <reference types='vitest' />

import { configDefaults, defineConfig } from 'vitest/config';

const coverage = 20;

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    coverage: {
      all: false,
      exclude: [...configDefaults.coverage.exclude!, 'spec/mock/**'],
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: coverage,
        functions: coverage,
        lines: coverage,
        statements: coverage,
      },
    },
    exclude: [...configDefaults.exclude],
  },
});

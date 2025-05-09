import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default', 'html'],
    coverage: { provider: 'v8', reportsDirectory: './coverage' }
  }
});
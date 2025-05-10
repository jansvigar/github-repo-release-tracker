import { defineConfig, mergeConfig } from 'vitest/config';
import base from '@ghtracker/config/vitest';

export default mergeConfig(
  base,
  defineConfig({
    test: {
      environment: 'node',
      setupFiles: ['./setup-test.ts'],
    }
  })
);
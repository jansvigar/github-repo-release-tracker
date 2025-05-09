import { defineConfig, mergeConfig } from 'vitest/config';
import base from '@ghtracker/config/vitest';
import react from '@vitejs/plugin-react';   

export default mergeConfig(
  base,
  defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ["./setup-test.ts"],
      css: true
    }
  })
);
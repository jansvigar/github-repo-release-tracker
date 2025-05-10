import { defineConfig, mergeConfig } from "vitest/config";
import base from "@ghtracker/config/vitest";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  base,
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    test: {
      environment: "jsdom", 
      setupFiles: "./setup-test.ts",
      css: true,
    },
  }),
);

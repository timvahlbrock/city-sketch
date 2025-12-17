import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    exclude: ["./e2e", "node_modules"],
    coverage: process.env.CI ? {} : undefined,
  },
});

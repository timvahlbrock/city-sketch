import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    exclude: ["./e2e", "node_modules"],
    coverage: {
      include: ["./convex"],
      enabled: !!process.env.CI,
      exclude: ["**generated**", "*.config.ts", "auth.ts"],
    },
  },
});

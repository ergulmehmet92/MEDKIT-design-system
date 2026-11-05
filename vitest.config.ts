import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["components/{atoms,molecules,organisms}/**/*.test.tsx", "scripts/**/*.test.mjs"],
  },
});

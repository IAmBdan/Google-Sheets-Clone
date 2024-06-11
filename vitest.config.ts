import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ["src/tests/components.test.tsx"],
    environment: "jsdom",
  },
});

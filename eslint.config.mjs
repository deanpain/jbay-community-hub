import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/mobile/**",
      ".expo/**",
      "**/build/**",
      "**/.pnpm-store/**",
      "**/vitest.config.ts",
    ],
  },
  {
    files: ["packages/**/*.ts", "services/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);

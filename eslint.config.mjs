import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Custom rules and overrides
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [".next/*", "out/*", "build/*", "public/*"],
  },
];

export default eslintConfig;

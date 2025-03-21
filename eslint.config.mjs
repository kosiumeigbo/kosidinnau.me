import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts"],
  plugins: { "@typescript-eslint": tseslint.plugin },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { project: "./tsconfig.json" },
  },
  ignores: [
    "tailwind.config.ts",
    "commitlint.config.js",
    "postcss.config.js",
    "prettier.config.js",
    "next.config.mjs",
    "**/.next/**/*.ts",
    "node_modules/",
  ],
  extends: [eslint.configs.recommended, tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      {
        "ignoreArrowShorthand": true,
      },
    ],
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/only-throw-error": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
});

/** @type {import("prettier").Config} */

const config = {
  arrowParens: "always",
  bracketSpacing: true,
  insertPragma: false,
  singleAttributePerLine: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 120,
  quoteProps: "preserve",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  embeddedLanguageFormatting: "auto",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "twMerge"],
  tailwindAttributes: ["className", "classNameDiv", "classNameInput"],
  overrides: [
    {
      files: "*.html",
      options: { parser: "html" },
    },
  ],
};

module.exports = config;

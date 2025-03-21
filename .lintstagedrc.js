const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [buildEslintCommand],
};

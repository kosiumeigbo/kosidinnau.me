const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
};

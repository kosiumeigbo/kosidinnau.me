// @ts-check
const { validateWritingFile } = require("./shared/utils");

/**
 * @param {string[]} filenames
 * @returns {string}
 */
const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

/**
 * @param {string[]} filenames
 * @returns {Promise<void>}
 */
const prepareWritingFileForCommit = async (filenames) => {
  for await (const file of filenames) {
    try {
      await validateWritingFile(file);
    } catch (e) {
      // @ts-ignore
      console.log(e.message);
      process.exit(1);
    }
  }
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "writings/*.html": [prepareWritingFileForCommit],
};

const { writingPreCommitFunction } = require("./shared/utils");

const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

const printOutFile = async (filenames) => {
  for await (const file of filenames) {
    try {
      await writingPreCommitFunction(file);
      console.log(file);
    } catch (e) {
      console.log(e.message);
      process.exit(1);
    }
  }
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "writings/*.html": [printOutFile],
};

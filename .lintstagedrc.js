const { writingPreCommitFunction } = require("./shared/utils");

const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

const printOutFile = async (filenames) => {
  for await (const file of filenames) {
    await writingPreCommitFunction(file);
    console.log(file);
  }
  console.log("This was successful. Just putting is unsuccessful for dev purposes!");
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "writings/*.html": [printOutFile],
};

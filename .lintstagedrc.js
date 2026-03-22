// import fs from "node:fs";
const fs = require("node:fs");
const readline = require("node:readline");
// import readline from "node:readline";

const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

const printOutFile = async (filenames) => {
  for await (const file of filenames) {
    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // const lines = [];
    for await (const line of rl) {
      console.log(line);
    }
  }
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "script_test_file.txt": [printOutFile],
};

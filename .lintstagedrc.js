const fs = require("node:fs");
const readline = require("node:readline");
const { promisify } = require("node:util");
const child_process = require("node:child_process");
const exec = promisify(child_process.exec);

const eslintCommand = (filenames) => `eslint ${filenames.join(" ")}`;

const printOutFile = async (filenames) => {
  for await (const file of filenames) {
    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const { stdout: stdout1 } = await exec(`sed -n 1p ${file}`);
    if (stdout1.trim() !== "---") {
      console.log(`Invalid frontmatter found in '${file}'`);
      process.exit(1);
    }

    const { stdout: stdout2 } = await exec(`grep -w -n -e '---' ${file} | sed -n 2p`);
    if (stdout2.trim() === "") {
      console.log(`Invalid frontmatter found in '${file}'`);
      process.exit(1);
    }

    const frontMatterEndLineNumber = Number(stdout2.trim().split(":")[0]);

    const { stdout: stdout3 } = await exec(`sed -n '1,${frontMatterEndLineNumber}p' ${file}`);
    const fullFrontMatterArray = stdout3.split("\n");
    fullFrontMatterArray.pop();
    fullFrontMatterArray.pop();
    fullFrontMatterArray.shift();
    const frontMatter = fullFrontMatterArray.map((str) => str.trim());
    console.log(frontMatter);

    // Loop till the second '---' is found
    // Add the front matter lines to an array and stop when the second '---' is found
    // Check if there is existing title, description and tags. If any one is absent, stop the process
    // Check if dateModified exists.
    //    If it doesn't add a new line below the first '---' with the format with a new Date
    //    If it exists, find the line using sed and then edit the whole line with the format with a new Date

    /* const frontMatter = [];
    let endOfFrontmatter = 0;

    for await (const [i, line] of rl) {
      if (i === 0 && line.trim() !== "---") {
        process.exit(1);
      }
      console.log(line);
    } */
  }
  console.log("This was successful. Just putting is unsuccessful for dev purposes!");
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "writings/*.html": [printOutFile],
};

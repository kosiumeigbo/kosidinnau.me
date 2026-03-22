const fs = require("node:fs");
const readline = require("node:readline");
const { promisify } = require("node:util");
const child_process = require("node:child_process");
const { requiredPropKeys, dateModified } = require("./shared/constants");

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
    // console.log(frontMatter);

    // Front matter should only contain values in requiredProps
    /* frontMatter.forEach((str) => {
      const key = str.split(":")[0].trim();
      if (!requiredPropKeys.includes(key)) {
        console.log(`Invalid frontmatter found in '${file}': Invalid prop ${key}`);
        process.exit(1);
      }
    }); */

    // Remove duplicates of the required props
    requiredPropKeys.forEach((prop) => {
      const repeatedProp = frontMatter.filter((str) => str.split(":")[0].trim() === prop);
      if (repeatedProp.length > 1) {
        console.log(`Invalid frontmatter found in '${file}': Multiple '${prop}' props found`);
        process.exit(1);
      }
    });

    // Ensure the front matter of the file has all required props
    const frontMatterProps = frontMatter.map((item) => item.split(":")[0].trim());
    const allRequiredPropsInFrontMatter = requiredPropKeys.every((item) => {
      return frontMatterProps.includes(item);
    });
    if (!allRequiredPropsInFrontMatter) {
      console.log(`Invalid frontmatter found in '${file}': Incomplete required props`);
      process.exit(1);
    }

    try {
      const { stdout: stdout4 } = await exec(`grep -n '${dateModified}' ${file}`);
      console.log("stdout: ", stdout4);
      const dateModifiedLines = stdout4.split("\n");
      dateModifiedLines.pop();
      console.log(dateModifiedLines);
      if (dateModifiedLines.length > 1) {
        console.log(`Invalid frontmatter found in '${file}': Multiple '${dateModified}' props found`);
        process.exit(1);
      }
      const lineNumberOfDateModified = dateModifiedLines[0].split(":")[0];
      console.log(lineNumberOfDateModified);

      const newDateModified = new Date();
      const yearString = newDateModified.getFullYear().toString();
      const monthString = (newDateModified.getMonth() + 2).toString();
      const dayString = newDateModified.getDate().toString();

      const sedCommand = `sed -i '' '${lineNumberOfDateModified}c\\\n${dateModified}: ${yearString}-${monthString}-${dayString}\n' ${file}`;
      console.log(sedCommand);
      await exec(sedCommand);
      await exec(`git add ${file}`);
      // await exec(`git commit -m "chore: added ${dateModified} in file"`);
    } catch (e) {
      if (e.code === 1) {
        console.log(`${dateModified} pattern not found in ${file}`);
        const newDateModified = new Date();
        const yearString = newDateModified.getFullYear().toString();
        const monthString = (newDateModified.getMonth() + 1).toString();
        const dayString = newDateModified.getDate().toString();
        const sedCommand = `sed -i '' '${frontMatterEndLineNumber}i\\\n${dateModified}: ${yearString}-${monthString}-${dayString}\n' ${file}`;
        await exec(sedCommand);
        await exec("git add .");
        await exec(`git commit -m "chore: added ${dateModified} in file"`);
      } else {
        console.log("grep has failed!");
        process.exit(1);
      }
    }

    // Loop till the second '---' is found
    // Add the front matter lines to an array and stop when the second '---' is found
    // Check if there is existing title, description and tags. If any one is absent, stop the process
    // Check if dateModified exists.
    //    If it doesn't add a new line below the first '---' with the format with a new Date
    //    If it exists, find the line using sed and then edit the whole line with the format with a new Date
  }
  console.log("This was successful. Just putting is unsuccessful for dev purposes!");
  process.exit(0);
};

module.exports = {
  "*.{js,jsx,ts,tsx,html,css}": ["prettier --write"],
  "src/**/*.{js,jsx,ts,tsx}": [eslintCommand],
  "writings/*.html": [printOutFile],
};

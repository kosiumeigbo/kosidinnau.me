// @ts-check
const { promisify } = require("node:util");
const child_process = require("node:child_process");
const { requiredPropKeys, dateModified, dateOriginallyPublished } = require("./constants");

/** @return {string} */
const getNewDateFormatted = function () {
  const newDatePublished = new Date();
  const yearString = newDatePublished.getFullYear().toString();
  const monthString = (newDatePublished.getMonth() + 1).toString();
  const dayString = newDatePublished.getDate().toString();
  return `${yearString}-${monthString}-${dayString}`;
};

/**
 * @param {string} file
 * @returns {Promise<void>}
 */
const writingPreCommitFunction = async function (file) {
  const fileNameWithoutDirectory = file.split("/").pop();
  // @ts-ignore: This will always run for a file in the writings directory in the root
  const fileNameWithoutExtension = fileNameWithoutDirectory.split(".")[0];
  const tempFile = `temp-file-${fileNameWithoutExtension}.txt`;

  const exec = promisify(child_process.exec);
  const { stdout: firstLineInFile } = await exec(`sed -n 1p ${file}`);
  if (firstLineInFile.trim() !== "---") {
    throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}': First line is not '---'\n`);
  }

  const { stdout: frontMatterEndLine } = await exec(`grep -w -n -e '---' ${file} | sed -n 2p`);
  if (frontMatterEndLine.trim() === "") {
    throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}'\n`);
  }

  const frontMatterEndLineNumber = Number(frontMatterEndLine.trim().split(":")[0].trim());

  const { stdout: fullFronMatterLinesText } = await exec(`sed -n '2,${frontMatterEndLineNumber - 1}p' ${file}`);
  const fullFrontMatterArray = fullFronMatterLinesText.split("\n");
  fullFrontMatterArray.pop(); // Remove the empty string at the end of the array
  const frontMatter = fullFrontMatterArray.map((str) => str.trim());

  // Check for duplicates of the required props.
  // Also check that all required props are in the frontmatter
  requiredPropKeys.forEach((prop) => {
    const filteredProp = frontMatter.filter((str) => str.split(":")[0].trim() === prop);
    if (filteredProp.length > 1) {
      throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}': Multiple '${prop}' props found\n`);
    }
    if (filteredProp.length === 0) {
      throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}': No '${prop}' prop found\n`);
    }
  });

  // Ensure the front matter of the file has all required props
  /** @type {[string, string[]][]} */
  const parsedFrontMatterLines = frontMatter.map((item) => {
    const [prop, ...value] = item.split(":");
    const trimmedProp = prop.trim();
    return [trimmedProp, value];
  });

  parsedFrontMatterLines.forEach(([prop, val]) => {
    // @ts-ignore
    if (requiredPropKeys.includes(prop)) {
      if (val.length === 0) {
        throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}': Empty '${prop}' value found\n`);
      } else {
        if (val.length === 1 && val[0].trim() === "") {
          throw new Error(`Invalid frontmatter found in '${fileNameWithoutDirectory}': Empty '${prop}' value found\n`);
        }
      }
    }
  });

  // find out if the file is in main
  // if it is in main, it probably has a dateOriginallyPublished. change the non-main branch file to make sure the dateOriginallyPublished did not change
  // if it is in main and doesn't have a dateOriginallyPublished, add the dateOriginallyPublished just above the second '---'
  // if it isn't in main, then add the dateOriginallyPublished just above the second '---'

  const { stdout: multiDateOrigPubl } = await exec(`grep -n '${dateOriginallyPublished}' ${file} | sed -n 2p`);
  if (multiDateOrigPubl.trim() !== "") {
    throw new Error(
      `Invalid frontmatter found in '${fileNameWithoutDirectory}': Multiple '${dateOriginallyPublished}' props found\n`,
    );
  }
  const { stdout: dateOrigPublLineText } = await exec(`grep -n '${dateOriginallyPublished}' ${file} | sed -n 1p`);

  try {
    await exec(`git show main:writings/${fileNameWithoutDirectory} > ${tempFile}`);

    const { stdout: dateOrigPublLineTextInMain } = await exec(
      `grep '${dateOriginallyPublished}' ${tempFile} | sed -n 1p`,
    );
    if (dateOrigPublLineText.trim() === "") {
      console.log(`Adding a ${dateOriginallyPublished} to ${file}...`);
      const sedCommand = `sed -i '' '${frontMatterEndLineNumber}i\\\n${dateOrigPublLineTextInMain}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    } else {
      const lineNumberOfDateOriginallyPublished = dateOrigPublLineText.split(":")[0];
      const sedCommand = `sed -i '' '${lineNumberOfDateOriginallyPublished}c\\\n${dateOrigPublLineTextInMain}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    }
  } catch (e) {
    // @ts-ignore
    if (e.code === 128) {
      if (dateOrigPublLineText.trim() === "") {
        console.log(`${file} not found in main branch`);
        console.log(`Adding a ${dateOriginallyPublished} to ${file}...`);

        const sedCommand = `sed -i '' '${frontMatterEndLineNumber}i\\\n${dateOriginallyPublished}: ${getNewDateFormatted()}\n' ${file}`;
        await exec(sedCommand);
        await exec(`git add ${file}`);
      } else {
        console.log(`${file} not found in main branch`);
        console.log(`Modifying existing ${dateOriginallyPublished} in ${file}...`);

        const lineNumberOfDateOriginallyPublished = dateOrigPublLineText.split(":")[0];

        const sedCommand = `sed -i '' '${lineNumberOfDateOriginallyPublished}c\\\n${dateOriginallyPublished}: ${getNewDateFormatted()}\n' ${file}`;
        await exec(sedCommand);
        await exec(`git add ${file}`);
      }
    } else {
      console.log("'git show' has failed!");
      process.exit(1);
    }
  } finally {
    await exec(`rm -f ${tempFile}`);
  }

  try {
    const { stdout: stdout4 } = await exec(`grep -n '${dateModified}' ${file}`);
    const dateModifiedLines = stdout4.split("\n");
    dateModifiedLines.pop();
    if (dateModifiedLines.length > 1) {
      console.log(`Invalid frontmatter found in '${file}': Multiple '${dateModified}' props found`);
      process.exit(1);
    }
    const lineNumberOfDateModified = dateModifiedLines[0].split(":")[0];

    console.log(`Modifying existing ${dateModified} in ${file}...`);

    const sedCommand = `sed -i '' '${lineNumberOfDateModified}c\\\n${dateModified}: ${getNewDateFormatted()}\n' ${file}`;
    await exec(sedCommand);
    // await exec(`git add ${file}`);
  } catch (e) {
    console.log(e);
    const { stdout: stdout7 } = await exec(`grep -w -n -e '---' ${file} | sed -n 2p`);
    const updatedFrontMatterEndLineNumber = Number(stdout7.trim().split(":")[0].trim());
    // @ts-ignore
    if (e.code === 1) {
      console.log(`${dateModified} pattern not found in ${file}`);
      console.log(`Adding a ${dateModified} to ${file}...`);

      const sedCommand = `sed -i '' '${updatedFrontMatterEndLineNumber}i\\\n${dateModified}: ${getNewDateFormatted()}\n' ${file}`;
      await exec(sedCommand);
      // await exec(`git add ${file}`);
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
};

module.exports = {
  getNewDateFormatted,
  writingPreCommitFunction,
};

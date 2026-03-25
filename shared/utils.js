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
  const exec = promisify(child_process.exec);
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

  const frontMatterEndLineNumber = Number(stdout2.trim().split(":")[0].trim());

  const { stdout: stdout3 } = await exec(`sed -n '1,${frontMatterEndLineNumber}p' ${file}`);
  const fullFrontMatterArray = stdout3.split("\n");
  fullFrontMatterArray.pop();
  fullFrontMatterArray.pop();
  fullFrontMatterArray.shift();
  const frontMatter = fullFrontMatterArray.map((str) => str.trim());

  // Remove duplicates of the required props
  requiredPropKeys.forEach((prop) => {
    const repeatedProp = frontMatter.filter((str) => str.split(":")[0].trim() === prop);
    if (repeatedProp.length > 1) {
      console.log(`Invalid frontmatter found in '${file}': Multiple '${prop}' props found`);
      process.exit(1);
    }
  });

  // Ensure the front matter of the file has all required props
  // const frontMatterProps = frontMatter.map((item) => item.split(":")[0].trim());

  /** @type {[string, string[]][]} */
  const frontMatterLinesParsed = frontMatter.map((item) => {
    const [prop, ...value] = item.split(":");
    const trimmedProp = prop.trim();
    return [trimmedProp, value];
  });

  const frontMatterProps = frontMatterLinesParsed.map(([prop, _]) => {
    return prop;
  });

  const frontMatterPropValues = frontMatterLinesParsed.map(([_, values]) => {
    return values.join(":");
  });

  const allRequiredPropsInFrontMatter = requiredPropKeys.every((item) => {
    return frontMatterProps.includes(item);
  });
  if (!allRequiredPropsInFrontMatter) {
    console.log(`Invalid frontmatter found in '${file}': Incomplete required props`);
    process.exit(1);
  }

  const hasInvalidPropValue = frontMatterPropValues.some((val) => val.trim() === "");
  if (hasInvalidPropValue) {
    console.log(`Invalid frontmatter found in '${file}': Empty prop value found`);
    process.exit(1);
  }

  // find out if the file is in main
  // if it is in main, it probably has a dateOriginallyPublished. change the non-main branch file to make sure the dateOriginallyPublished did not change
  // if it is in main and doesn't have a dateOriginallyPublished, add the dateOriginallyPublished just above the second '---'
  // if it isn't in main, then add the dateOriginallyPublished just above the second '---'

  const splitFile = file.split("/");
  const fileNameWithoutDirectory = splitFile.pop();
  // @ts-ignore: This will always run for a file in the writings directory in the root
  const fileNameWithoutExtension = fileNameWithoutDirectory.split(".")[0];
  const tempFile = `temp-file-${fileNameWithoutExtension}.txt`;
  console.log(fileNameWithoutDirectory, fileNameWithoutExtension, tempFile);

  try {
    await exec(`git show main:writings/${fileNameWithoutDirectory} > ${tempFile}`);

    const { stdout: stdout5 } = await exec(`grep '${dateOriginallyPublished}' ${tempFile} | sed -n 1p`);
    const { stdout: stdout6 } = await exec(`grep -n '${dateOriginallyPublished}' ${file} | sed -n 1p`);
    if (stdout6.trim() === "") {
      console.log(`Adding a ${dateOriginallyPublished} to ${file}...`);
      const sedCommand = `sed -i '' '${frontMatterEndLineNumber}i\\\n${stdout5}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    } else {
      const lineNumberOfDateOriginallyPublished = stdout6.split(":")[0];
      const sedCommand = `sed -i '' '${lineNumberOfDateOriginallyPublished}c\\\n${stdout5}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    }
  } catch (e) {
    // @ts-ignore
    if (e.code === 128) {
      console.log(`${file} not found in main branch`);
      console.log(`Adding a ${dateOriginallyPublished} to ${file}...`);

      const sedCommand = `sed -i '' '${frontMatterEndLineNumber}i\\\n${dateOriginallyPublished}: ${getNewDateFormatted()}\n' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
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

    const sedCommand = `sed -i '' '${lineNumberOfDateModified}c\\\n${dateModified}: ${getNewDateFormatted()}\n' ${file}`;
    await exec(sedCommand);
    await exec(`git add ${file}`);
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
      await exec(`git add ${file}`);
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

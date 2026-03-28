// @ts-check
const { promisify } = require("node:util");
const child_process = require("node:child_process");
const { requiredPropKeys, dateModified, dateOriginallyPublished } = require("./constants");
const exec = promisify(child_process.exec);

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
 * @returns {Promise<[string, string[]][]>}
 */
const validateFrontMatterInFile = async function (file) {
  const fileNameWithoutDirectory = file.split("/").pop();

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

  return parsedFrontMatterLines;
};

/**
 * @param {string} file
 * @returns {Promise<void>}
 */
const validateWritingFile = async function (file) {
  const fileNameWithoutDirectory = file.split("/").pop();
  // @ts-ignore: This will always run for a file in the writings directory in the root
  const fileNameWithoutExtension = fileNameWithoutDirectory.split(".")[0];
  const tempFile = `temp-file-${fileNameWithoutExtension}.txt`;

  await validateFrontMatterInFile(file);

  const { stdout: currentFrontMatterEndLine } = await exec(`grep -w -n -e '---' ${file} | sed -n 2p`);

  const currentFrontMatterEndLineNumber = Number(currentFrontMatterEndLine.trim().split(":")[0].trim());

  const { stdout: multiDateOrigPubl } = await exec(`grep -n '${dateOriginallyPublished}' ${file} | sed -n 2p`);
  if (multiDateOrigPubl.trim() !== "") {
    throw new Error(
      `Invalid frontmatter found in '${fileNameWithoutDirectory}': Multiple '${dateOriginallyPublished}' props found\n`,
    );
  }
  const { stdout: dateOrigPublLineText } = await exec(`grep -n '${dateOriginallyPublished}' ${file} | sed -n 1p`);
  const dateOrigPublLineNumber = Number(dateOrigPublLineText.trim().split(":")[0].trim());

  try {
    await exec(`git show main:writings/${fileNameWithoutDirectory} > ${tempFile}`);

    const { stdout: dateOrigPublLineTextInMain } = await exec(
      `grep '${dateOriginallyPublished}' ${tempFile} | sed -n 1p`,
    );
    if (dateOrigPublLineText.trim() === "") {
      console.log(`Adding a ${dateOriginallyPublished} to ${fileNameWithoutDirectory}...\n`);

      const sedCommand = `sed -i '' '${currentFrontMatterEndLineNumber}i\\\n${dateOrigPublLineTextInMain}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    } else {
      console.log(`Modifying existing ${dateOriginallyPublished} in ${fileNameWithoutDirectory}...\n`);

      const sedCommand = `sed -i '' '${dateOrigPublLineNumber}c\\\n${dateOrigPublLineTextInMain}' ${file}`;
      await exec(sedCommand);
      await exec(`git add ${file}`);
    }
  } catch (e) {
    // @ts-ignore
    if (e.code === 128) {
      console.log(`${fileNameWithoutDirectory} not found in main branch\n`);
      if (dateOrigPublLineText.trim() === "") {
        console.log(`Adding a ${dateOriginallyPublished} to ${fileNameWithoutDirectory}...\n`);

        const sedCommand = `sed -i '' '${currentFrontMatterEndLineNumber}i\\\n${dateOriginallyPublished}: ${getNewDateFormatted()}\n' ${file}`;
        await exec(sedCommand);
        await exec(`git add ${file}`);
      } else {
        console.log(`Modifying existing ${dateOriginallyPublished} in ${fileNameWithoutDirectory}...\n`);

        const sedCommand = `sed -i '' '${dateOrigPublLineNumber}c\\\n${dateOriginallyPublished}: ${getNewDateFormatted()}\n' ${file}`;
        await exec(sedCommand);
        await exec(`git add ${file}`);
      }
    } else {
      throw new Error("'git show' has failed!\n");
    }
  } finally {
    await exec(`rm -f ${tempFile}`);
  }

  const { stdout: multiDateModified } = await exec(`grep -n '${dateModified}' ${file} | sed -n 2p`);
  if (multiDateModified.trim() !== "") {
    throw new Error(
      `Invalid frontmatter found in '${fileNameWithoutDirectory}': Multiple '${dateModified}' props found\n`,
    );
  }
  const { stdout: dateModifiedLineText } = await exec(`grep -n '${dateModified}' ${file} | sed -n 1p`);
  const { stdout: newFrontMatterEndLineText } = await exec(`grep -w -n -e '---' ${file} | sed -n 2p`);
  const newFrontMatterEndLineNumber = Number(newFrontMatterEndLineText.trim().split(":")[0].trim());

  if (dateModifiedLineText.trim() === "") {
    console.log(`'${dateModified}' not found in ${fileNameWithoutDirectory}\n`);
    console.log(`Adding a '${dateModified}' to ${fileNameWithoutDirectory}...\n`);

    const sedCommand = `sed -i '' '${newFrontMatterEndLineNumber}i\\\n${dateModified}: ${getNewDateFormatted()}\n' ${file}`;
    await exec(sedCommand);
    await exec(`git add ${file}`);
  } else {
    const dateModifiedLineNumber = Number(dateModifiedLineText.trim().split(":")[0].trim());
    console.log(`Modifying existing ${dateModified} in ${fileNameWithoutDirectory}...\n`);

    const sedCommand = `sed -i '' '${dateModifiedLineNumber}c\\\n${dateModified}: ${getNewDateFormatted()}\n' ${file}`;
    await exec(sedCommand);
    await exec(`git add ${file}`);
  }
};

module.exports = {
  getNewDateFormatted,
  validateFrontMatterInFile,
  validateWritingFile,
};

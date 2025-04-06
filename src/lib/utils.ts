import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const propKeysStringValue = ["title", "description"] as const;
const propKeysNotStringValue = ["date", "tags"] as const;
// const allPropKeys = [...propKeysStringValue, ...propKeysNotStringValue];

type PropKeysStringValueType = (typeof propKeysStringValue)[number];
type PropKeysNotStringValueType = (typeof propKeysNotStringValue)[number];

const getSlugsForAllWritings = function () {
  const writingsPath = path.resolve(process.cwd(), "writings");
  const filesInWritings = fs.readdirSync(writingsPath);
  const slugs = filesInWritings.map((filePath) => filePath.split(".html")[0]);
  console.log(slugs);
  return slugs;
};

export const getInfoObjForFileInWritings = async function (slug: string) {
  const filePath = path.resolve(process.cwd(), "writings", `${slug}.html`);
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line);
  }

  console.log(lines);

  if (lines.filter((obj) => obj.trim() === "---").length < 2) {
    throw Error(`Invalid frontmatter found in '${slug}.html'`);
  }

  let endOfFrontmatter = 0;
  let linesIndex = 0;

  while (endOfFrontmatter < 2) {
    if (lines[linesIndex].trim() === "---") {
      endOfFrontmatter = endOfFrontmatter + 1;
    }
    linesIndex++;
  }

  const frontMatterArray = lines
    .splice(0, linesIndex)
    .filter((str) => str.trim() !== "" && str.trim() !== "---")
    .map((str) => str.trim());

  if (frontMatterArray.length === 0) {
    throw Error(`Invalid frontmatter found in '${slug}.html'`);
  }

  const htmlContent = lines.join("");
  console.log(frontMatterArray, slug, htmlContent);

  const documentDataPropKeyStringValuesObject = Object.fromEntries(
    propKeysStringValue.map((propKey) => [propKey, getFrontMatterPropKeyStringValue(frontMatterArray, slug, propKey)]),
  ) as Record<PropKeysStringValueType, string>;

  console.log(JSON.stringify(documentDataPropKeyStringValuesObject));

  return { ...documentDataPropKeyStringValuesObject, date: Date.now().toString(), htmlContent, slug };
};

const getFrontMatterPropKeyStringValue = function (
  frontMatterArray: string[],
  slug: string,
  propKey: PropKeysStringValueType,
) {
  const filteredPropArray = frontMatterArray.filter((str) => str.split(":")[0].trim().toLowerCase() === propKey);
  if (filteredPropArray.length > 1) {
    throw new Error(`Invalid Frontmatter: Multiple '${propKey}' props found in '${slug}.html'`);
  }

  if (filteredPropArray.length === 0) {
    throw new Error(`Invalid Frontmatter: No '${propKey}' prop found in '${slug}.html'`);
  }

  const [_, ...propValues] = filteredPropArray[0].split(":");
  if (propValues.length === 0) {
    throw new Error(`Invalid Frontmatter: Empty '${propKey}' value found in '${slug}.html'`);
  }

  if (propValues.length === 1) {
    if (propValues[0].length === 0) {
      throw new Error(`Invalid Frontmatter: Empty '${propKey}' value found in '${slug}.html'`);
    }
    return propValues[0].trim();
  }

  return propValues.join(":").trim();
};

export const getInfoObjArrayForAllFilesInWritings = async function () {
  const promisesArray = getSlugsForAllWritings().map((slug) => getInfoObjForFileInWritings(slug));
  const settledValues = await Promise.all(promisesArray);
  return settledValues;
};

void getSlugsForAllWritings().map((slug) => getInfoObjForFileInWritings(slug));

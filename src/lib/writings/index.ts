import { getSlugsForAllWritings, getFrontMatterPropKeyStringValue } from "./helpers";
import {
  PropKeysNotStringValueType,
  PropKeysStringValueType,
  propKeysStringValue,
  propKeysNotStringValue,
} from "@/lib/types";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

export const getMetaDataForFileInWritings = async function (slug: string) {
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

export const getMetaDataForAllFilesInWritings = async function () {
  const promisesArray = getSlugsForAllWritings().map((slug) => getMetaDataForFileInWritings(slug));
  const settledValues = await Promise.all(promisesArray);
  return settledValues;
};

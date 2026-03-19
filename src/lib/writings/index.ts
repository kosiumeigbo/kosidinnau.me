import { getSlugsForAllWritings, getValueFromFrontMatterKey } from "./helpers";
import { FrontMatterObjectType, allFrontMatterKeys, dateOriginallyPublished, dateModified } from "@/lib/types";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

export const getMetaDataForSingleFileInWritings = async function (slug: string) {
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

  const dateOriginallyPublishedFrontMatterLine = frontMatterArray.find(
    (str) => str.split(":")[0].trim() === dateOriginallyPublished,
  );

  if (!dateOriginallyPublishedFrontMatterLine) {
    const newDatePublished = new Date();
    const yearString = newDatePublished.getFullYear().toString();
    const monthString = (newDatePublished.getMonth() + 1).toString();
    const dayString = newDatePublished.getDate().toString();
    frontMatterArray.push(`${dateOriginallyPublished}: ${yearString}-${monthString}-${dayString}`);
  }

  const dateModifiedFrontMatterLine = frontMatterArray.find((str) => str.split(":")[0].trim() === dateModified);

  if (!dateModifiedFrontMatterLine) {
    const newDateModified = new Date();
    const yearString = newDateModified.getFullYear().toString();
    const monthString = (newDateModified.getMonth() + 1).toString();
    const dayString = newDateModified.getDate().toString();
    frontMatterArray.push(`${dateModified}: ${yearString}-${monthString}-${dayString}`);
  }
  console.log("FrontMatterArray: ", frontMatterArray);

  const htmlContent = lines.join("");

  const documentFrontMatterValuesObject = Object.fromEntries(
    allFrontMatterKeys.map((propKey) => [propKey, getValueFromFrontMatterKey(frontMatterArray, slug, propKey)]),
  ) as unknown as FrontMatterObjectType;

  const metaDataForFileInWritings = {
    ...documentFrontMatterValuesObject,
    htmlContent,
    slug,
  };

  console.log(metaDataForFileInWritings);

  return metaDataForFileInWritings;
};

export const getMetaDataForAllFilesInWritings = async function () {
  const promisesArray = getSlugsForAllWritings().map((slug) => getMetaDataForSingleFileInWritings(slug));
  const settledValues = await Promise.all(promisesArray);
  return settledValues;
};

export { getSlugsForAllWritings };

import fs from "node:fs";
import path from "node:path";
import { PropKeysStringValueType, PropKeysNotStringValueType } from "@/lib/types";

export const getSlugsForAllWritings = function () {
  const writingsPath = path.resolve(process.cwd(), "writings");
  const filesInWritings = fs.readdirSync(writingsPath);
  const slugs = filesInWritings.map((filePath) => filePath.split(".html")[0]);
  console.log(slugs);
  return slugs;
};

export const getFrontMatterPropKeyStringValue = function (
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

export const getFrontMatterPropKeyNotStringValue = function (
  frontMatterArray: string[],
  slug: string,
  propKey: PropKeysNotStringValueType,
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

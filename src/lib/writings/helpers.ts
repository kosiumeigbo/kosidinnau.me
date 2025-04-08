import fs from "node:fs";
import path from "node:path";
import { PropKeysStringValueType, PropKeysNonStringValueType } from "@/lib/types";

const validatePropKeysFrontMatterValue = function (
  frontMatterArray: string[],
  slug: string,
  propKey: PropKeysStringValueType | PropKeysNonStringValueType,
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
    if (propValues[0].trim().length === 0) {
      throw new Error(`Invalid Frontmatter: Empty '${propKey}' value found in '${slug}.html'`);
    }
    return propValues[0].trim();
  }

  return propValues.join(":").trim();
};

export const getSlugsForAllWritings = function () {
  const writingsPath = path.resolve(process.cwd(), "writings");
  const filesInWritings = fs.readdirSync(writingsPath);
  const slugs = filesInWritings.map((filePath) => filePath.split(".html")[0]);
  return slugs;
};

export const getPropKeyStringValueFromFrontMatter = function (
  frontMatterArray: string[],
  slug: string,
  propKey: PropKeysStringValueType,
) {
  const validStringValueForPropKey = validatePropKeysFrontMatterValue(frontMatterArray, slug, propKey);
  return validStringValueForPropKey;
};

export const getPropKeyNonStringValueFromFrontMatter = function (
  frontMatterArray: string[],
  slug: string,
  propKey: PropKeysNonStringValueType,
) {
  const validFrontMatterValueForPropKey = validatePropKeysFrontMatterValue(frontMatterArray, slug, propKey);

  switch (propKey) {
    case "date":
      return getDateValue(validFrontMatterValueForPropKey, slug, propKey);
    case "tags":
      return getTagsValue(validFrontMatterValueForPropKey);
    default:
      throw new Error("Invalid Prop Key being used");
  }
};

const getDateValue = function (
  validFrontMatterValueForPropKey: string,
  slug: string,
  propKey: Extract<PropKeysNonStringValueType, "date">,
) {
  const dateParamsArray = validFrontMatterValueForPropKey.split("-");
  if (dateParamsArray.length !== 3) {
    throw new Error(`Invalid FrontMatter: Invalid ${propKey} format found in '${slug}'.html`);
  }

  const findNaN = dateParamsArray.find((string) => Number.isNaN(parseInt(string)));
  if (findNaN) {
    throw new Error(`Invalid FrontMatter: Invalid ${propKey} format found in '${slug}'.html`);
  }

  const possibleYearString = dateParamsArray[0];
  if (possibleYearString.length !== 4) {
    throw new Error(`Invalid FrontMatter: Invalid '${propKey}' year format found in '${slug}'.html`);
  }
  const possibleYearNumber = parseInt(possibleYearString);
  if (possibleYearNumber < 2025) {
    throw new Error(`Invalid FrontMatter: Invalid '${propKey}' year format found in '${slug}'.html`);
  }
  const yearNumber = possibleYearNumber;

  const possibleMonthNumber = parseInt(dateParamsArray[1]);
  if (possibleMonthNumber < 1 || possibleMonthNumber > 12) {
    throw new Error(`Invalid FrontMatter: Invalid '${propKey}' month format found in '${slug}'.html`);
  }
  const monthNumber = possibleMonthNumber - 1;

  const possibleDateNumber = parseInt(dateParamsArray[2]);
  if (possibleDateNumber < 1 || possibleDateNumber > 31) {
    throw new Error(`Invalid FrontMatter: Invalid '${propKey}' day format found in '${slug}'.html`);
  }
  const dateNumber = possibleDateNumber;

  const newDate = new Date(yearNumber, monthNumber, dateNumber);
  if (Number.isNaN(newDate.valueOf())) {
    throw new Error(`Invalid FrontMatter: Invalid ${propKey} format found in '${slug}'.html`);
  }
  return newDate;
};

const getTagsValue = function (validFrontMatterValueForPropKey: string) {
  const allTags = validFrontMatterValueForPropKey.split(",").map((tag) => tag.trim());
  return allTags;
};

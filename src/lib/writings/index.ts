/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSlugsForAllWritings, getValueFromFrontMatterKey } from "./helpers";
import { FrontMatterObjectType } from "@/lib/types";
import {
  allFrontMatterKeys,
  dateOriginallyPublished,
  dateModified,
  getNewDateFormatted,
  validateFrontMatterInFile,
} from "~/shared";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import child_process from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(child_process.exec);

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

  const parsedFrontMatterArray = await validateFrontMatterInFile(filePath);

  if (process.env.NODE_ENV === "development") {
    const dateOriginallyPublishedFrontMatterLine = parsedFrontMatterArray.find(
      (val) => val[0].trim() === dateOriginallyPublished,
    );

    if (!dateOriginallyPublishedFrontMatterLine) {
      parsedFrontMatterArray.push([dateOriginallyPublished, [getNewDateFormatted()]]);
    }

    const dateModifiedFrontMatterLine = parsedFrontMatterArray.find((val) => val[0].trim() === dateModified);

    if (!dateModifiedFrontMatterLine) {
      parsedFrontMatterArray.push([dateModified, [getNewDateFormatted()]]);
    }
  }

  const { stdout: frontMatterEndLine } = await exec(`grep -w -n -e '---' ${filePath} | sed -n 2p`);
  const frontMatterEndLineNumber = Number(frontMatterEndLine.trim().split(":")[0].trim());
  const { stdout: htmlContent } = await exec(`sed -n '${(frontMatterEndLineNumber + 1).toString()},$p' ${filePath}`);

  const documentFrontMatterValuesObject = Object.fromEntries(
    allFrontMatterKeys.map((propKey) => [propKey, getValueFromFrontMatterKey(parsedFrontMatterArray, slug, propKey)]),
  ) as unknown as FrontMatterObjectType;

  const metaDataForFileInWritings = {
    ...documentFrontMatterValuesObject,
    htmlContent,
    slug,
  };

  return metaDataForFileInWritings;
};

export const getMetaDataForAllFilesInWritings = async function () {
  const promisesArray = getSlugsForAllWritings().map((slug) => getMetaDataForSingleFileInWritings(slug));
  const settledValues = await Promise.all(promisesArray);
  return settledValues;
};

export { getSlugsForAllWritings };

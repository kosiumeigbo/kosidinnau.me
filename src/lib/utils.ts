import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

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

  return { title: "Writing Post", date: Date.now().toString(), htmlContent, slug };
};

export const getInfoObjArrayForAllFilesInWritings = async function () {
  const promisesArray = getSlugsForAllWritings().map((slug) => getInfoObjForFileInWritings(slug));
  const settledValues = await Promise.all(promisesArray);
  return settledValues;
};

void getSlugsForAllWritings().map((slug) => getInfoObjForFileInWritings(slug));

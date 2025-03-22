import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const getBlogSlugs = function () {
  const contentPath = path.resolve(process.cwd(), "content");
  const contentFolders = fs.readdirSync(contentPath);
  return contentFolders;
};

const getHtmlContents = async function (slug: string, index: number) {
  try {
    const pathToFile = path.resolve(process.cwd(), "content", slug, "index.html");
    const fileStream = fs.createReadStream(pathToFile);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines: string[] = [];
    for await (const line of rl) {
      lines.push(line);
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

    const htmlContent = lines.join("");

    console.log(`For file ${(index + 1).toString()}: `, frontMatterArray, htmlContent);
    return { title: "", date: Date.now().toString(), htmlContent };
  } catch (e) {
    console.error(`For file ${(index + 1).toString()}: `, e);
    return "";
  }
};

console.log(getBlogSlugs().map((slug, i) => getHtmlContents(slug, i)));

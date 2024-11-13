import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

export type ShowcaseContent = {
  readonly title: string;
  readonly slug: string;
  readonly image: string;
  readonly date: string;
  readonly fellow: string;
  readonly techUsed: string;
  readonly fullPath: string;
};

let showcaseCache: ShowcaseContent[];

export function fetchShowcaseContent(directory: string): ShowcaseContent[] {
  if (showcaseCache) {
    return showcaseCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(directory);
  showcaseCache = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });

      const matterData = matterResult.data as {
        title: string;
        slug: string;
        image: string;
        date: string;
        fellow: string;
        techUsed: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });

  // TODO: Sort showcases by date
  return showcaseCache;
}

export function countShowcases(directory: string): number {
  return fetchShowcaseContent(directory).length;
}

export function listShowcaseContent(
  directory: string,
  page: number,
  limit: number
): ShowcaseContent[] {
  return fetchShowcaseContent(directory)
    // Sort by date (newest to oldest)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return (dateA > dateB) ? -1 : (dateB > dateA) ? 1 : 0;
    })
    .slice((page - 1) * limit, page * limit);
}

import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const showcaseDirectory = path.join(process.cwd(), "content/showcase");

export type ShowcaseContent = {
  readonly title: string;
  readonly slug: string;
  readonly image: string;
  readonly date: string;
  readonly tags: Array<string>;
  readonly fellow: string;
  readonly techUsed: string;
  readonly fullPath: string;
};

let showcaseCache: ShowcaseContent[];

export function fetchShowcaseContent(): ShowcaseContent[] {
  if (showcaseCache) {
    return showcaseCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(showcaseDirectory);
  showcaseCache = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(showcaseDirectory, fileName);
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
        tags: Array<string>;
        fellow: string;
        techUsed: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });

  return showcaseCache;
}

export function countShowcases(tag?: string): number {
  return fetchShowcaseContent().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listShowcaseContent(
  page: number,
  limit: number,
  tag?: string
): ShowcaseContent[] {
  return fetchShowcaseContent()
    // Sort by date (newest to oldest)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return (dateA > dateB) ? -1 : (dateB > dateA) ? 1 : 0;
    })
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

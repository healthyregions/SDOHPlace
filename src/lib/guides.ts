import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const guidesDirectory = path.join(process.cwd(), "content/guides");

export type GuidesContent = {
  readonly last_updated: string;
  readonly description: string;
  readonly title: string;
  readonly slug: string;
  readonly featured_image: string;
  readonly author: string;
  //readonly body: string;
  readonly fullPath: string;
};

let guidesCache: GuidesContent[];

export function fetchGuidesContent(): GuidesContent[] {
  if (guidesCache) {
    return guidesCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(guidesDirectory);
  const allGuidesData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(guidesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        last_updated: string;
        description: string;
        title: string;
        featured_image: string;
        author: string;
        slug: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  guidesCache = allGuidesData.sort((a, b) => {
    if (a.last_updated < b.last_updated) {
      return 1;
    } else {
      return -1;
    }
  });
  return guidesCache;
}

export function countGuides(): number {
  return fetchGuidesContent().length;
}

export function listGuidesContent(
  page: number,
  limit: number
): GuidesContent[] {
  return fetchGuidesContent()
    .slice((page - 1) * limit, page * limit);
}

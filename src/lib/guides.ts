import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const guidesDirectory = path.join(process.cwd(), "content/guides");

export type GuideContent = {
  readonly last_updated: string;
  readonly title: string;
  readonly slug: string;
  readonly featured_image: string;
  //readonly body: string;
  readonly fullPath: string;
};

let guideCache: GuideContent[];

export function fetchGuideContent(): GuideContent[] {
  if (guideCache) {
    return guideCache;
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
        title: string;
        featured_image: string;
        slug: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  guideCache = allGuidesData.sort((a, b) => {
    if (a.last_updated < b.last_updated) {
      return 1;
    } else {
      return -1;
    }
  });
  return guideCache;
}

export function countGuides(): number {
  return fetchGuideContent().length;
}

export function listGuideContent(
  page: number,
  limit: number
): GuideContent[] {
  return fetchGuideContent()
    .slice((page - 1) * limit, page * limit);
}

import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const researchDirectory = path.join(process.cwd(), "content/research");

export type ResearchContent = {
  readonly publish_date: string;
  readonly title: string;
  //readonly description: string;
  readonly slug: string;
  readonly image: string;
  readonly media: string[];
  readonly body: string;
  readonly fullPath: string;
};

let researchCache: ResearchContent[];

export function fetchResearchContent(): ResearchContent[] {
  if (researchCache) {
    return researchCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(researchDirectory);
  const allResearchData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(researchDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        publish_date: string;
        title: string;
        //description: string;
        body: string;
        image: string;
        media: string[];
        slug: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      //matterData.description = matterData.body;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  researchCache = allResearchData.sort((a, b) => {
    if (a.publish_date < b.publish_date) {
      return 1;
    } else {
      return -1;
    }
  });
  return researchCache;
}

export function countResearch(): number {
  return fetchResearchContent().length;
}

export function listResearchContent(
  page: number,
  limit: number
): ResearchContent[] {
  return fetchResearchContent()
    .slice((page - 1) * limit, page * limit);
}

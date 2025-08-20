import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const researchDirectory = path.join(process.cwd(), "content/research");

export interface ResearchContent {
  publish_date: string;
  title: string;
  author: string;
  description: string;
  slug: string;
  image: string;
  media: string[];
  fullPath: string;
}

let researchCache: ResearchContent[];

export function fetchResearchContent(): ResearchContent[] {
  if (researchCache) {
    return researchCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(researchDirectory);
  const allResearchData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName): ResearchContent => {
      // Read markdown file as string
      const fullPath = path.join(researchDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as ResearchContent,
        },
      });

      // Synthesize ResearchContent from pieces we've fetched (maintain idempotence)
      return {
        ...matterResult.data as ResearchContent,
        fullPath,
        description: matterResult.content,
        slug: fileName.replace(/\.mdx$/, "")
      };
    });

  // Sort posts by date and update internal cache
  return researchCache = allResearchData.sort(
    (a: ResearchContent, b: ResearchContent) => (a.publish_date < b.publish_date) ? 1 : -1
  );
}

export function countResearch(): number {
  return fetchResearchContent().length;
}

export function listResearchContent(page: number, limit: number): ResearchContent[] {
  const start = (page - 1) * limit;
  const end = page * limit;
  return fetchResearchContent().slice(start, end);
}

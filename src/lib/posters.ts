import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { getGuideUpdatedDate } from "./guideDates";

const postersDirectory = path.join(process.cwd(), "content/posters");

export type PostersContent = {
  readonly title: string;
  readonly author: string;
  readonly institution: string;
  readonly year: string;
  readonly link: string;
  readonly image: string;
  readonly slug: string;
  //readonly body: string;
  readonly fullPath: string;
};

let postersCache: PostersContent[];

export function fetchPostersContent(): PostersContent[] {
  if (postersCache) {
    return postersCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postersDirectory);
  const allPostersData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(postersDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        title: string;
        author: string;
        institution: string;
        year: string;
        image: string;
        link: string;
        slug: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  // postersCache = allPostersData.sort(
  //   (a, b) => getPosterUpdatedDate(b).getTime() - getGuideUpdatedDate(a).getTime()
  // );
  return postersCache;
}

export function countPosters(): number {
  return fetchPostersContent().length;
}

export function listPostersContent(
  page: number,
  limit: number
): PostersContent[] {
  return fetchPostersContent()
    .slice((page - 1) * limit, page * limit);
}

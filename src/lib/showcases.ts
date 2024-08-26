import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

export type PostContent = {
  readonly date?: string;
  readonly title: string;
  readonly slug: string;
  readonly tags?: string[];
  readonly fullPath: string;
};

export type ShowcaseContent = {
  readonly title: string;
  readonly slug: string;
  readonly image: string;
  readonly fellow: string;
  readonly techUsed: string;
  readonly fullPath: string;
};

let postCache: PostContent[];

export function fetchPostContent(directory: string): PostContent[] {
  if (postCache) {
    return postCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(directory);
  const allPostsData = fileNames
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
        date: string;
        title: string;
        tags: string[];
        slug: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = fileName.replace(/\.mdx$/, "");

      return matterData;
    });
  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function countPosts(directory: string, tag?: string): number {
  return fetchPostContent(directory).filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listPostContent(
  directory: string,
  page: number,
  limit: number,
  tag?: string
): PostContent[] {
  return fetchPostContent(directory)
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

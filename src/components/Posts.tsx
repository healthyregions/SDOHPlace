import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostData {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
}

export function getSortedPostsData(): PostData[] {
  try {
    const postsDirectory = path.join(process.cwd(), "content/posts");
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData: PostData[] = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        id,
        ...(matterResult.data as {
          title: string;
          date: string;
          slug: string;
          excerpt: string;
          thumbnail: string;
        }),
      };
    });

    // Sort and filter the posts, ensuring to handle the possibility of missing dates
    return allPostsData
      .filter((post) => post.date)
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 3);
  } catch (error) {
    // Handle errors here. For example, log the error or return an empty array
    console.error("Error while fetching sorted posts data:", error);
    return [];
  }
}

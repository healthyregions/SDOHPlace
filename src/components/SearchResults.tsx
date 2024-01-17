import fs from "fs";
import path from "path";
import matter from "gray-matter";
// import {fetchJsonp, Headers} from "fetch-jsonp";

export interface SearchResults {
  id: string;
}

const fetchResults = async function (url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  console.log(res);
  console.log("sdfasdf");
  let results = await res.json();
  return results;
};

export async function getResults(): Promise<SearchResults[]> {
  const responseData = await fetchResults(
    "http://localhost:8983/solr/blacklight-core/select?q=*:*"
  );

  console.log(responseData.response.docs);
  // try {
  //   const postsDirectory = path.join(process.cwd(), "content/posts");
  //   const fileNames = fs.readdirSync(postsDirectory);
  //   const allPostsData: SearchResults[] = fileNames.map((fileName) => {
  //     const id = fileName.replace(/\.md$/, "");
  //     const fullPath = path.join(postsDirectory, fileName);
  //     const fileContents = fs.readFileSync(fullPath, "utf8");
  //     const matterResult = matter(fileContents);

  //     return {
  //       id,
  //       ...(matterResult.data as {
  //         title: string;
  //         date: string;
  //         slug: string;
  //         excerpt: string;
  //         thumbnail: string;
  //       }),
  //     };
  //   });

  // } catch (error) {
  //   // Handle errors here. For example, log the error or return an empty array
  //   console.error("Error while fetching sorted posts data:", error);
  //   return [];
  // }
  return [responseData.response.docs];
}

import fs from "fs";
import path from "path";

// this interface is not currently used, but the SchemaObject interface could
// ultimately something like this interface should take the place of the generic
// Object that is used within SchemaObject
export interface Schema {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
}

export interface SchemaObject {
  [key: string]: Object;
}

export function getSchema(): SchemaObject {
  try {
    const folder = path.join(process.cwd(), "meta", "_metadata");
    let finalJson: SchemaObject = {};
    const files = fs.readdirSync(folder);
    files.forEach((file) => {
      const filePath = path.join(folder, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        const parsedJson = JSON.parse(fileContent);
        finalJson = { ...finalJson, ...parsedJson };
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });
    return finalJson;
  } catch (error) {
    // Handle errors here. For example, log the error or return an empty array
    console.error("Error while fetching sorted posts data:", error);
    return { error: error };
  }
}

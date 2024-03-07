// pages/api/metadata.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const folder = path.join(process.cwd(), "meta", "_metadata");
  let finalJson: { [key: string]: any } = {};
  try {
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

    res.status(200).json(finalJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read metadata files" });
  }
}

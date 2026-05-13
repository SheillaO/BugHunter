import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getData() {
  try {
    
    const pathJSON = path.join(__dirname, "..", "data", "bugs.json");
    const data = await fs.readFile(pathJSON, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Warning: bugs.json could not be read:", err.message);
    return [];
  }
}

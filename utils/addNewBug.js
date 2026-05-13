import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getData } from "./getData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function addNewBug(newBug) {
  try {
    const bugs = await getData();
    bugs.push(newBug);

    
    const pathJSON = path.join(__dirname, "..", "data", "bugs.json");

    await fs.writeFile(pathJSON, JSON.stringify(bugs, null, 2), "utf8");
  } catch (err) {
    throw new Error(`Failed to save bug report: ${err.message}`);
  }
}

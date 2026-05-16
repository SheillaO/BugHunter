import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { getData } from "./getData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathJSON = path.join(__dirname, "..", "data", "bugs.json");

export async function addNewBug(newBug) {
  try {
    const bugs = await getData();

    newBug.uuid = crypto.randomUUID();
    bugs.push(newBug);

    await fs.writeFile(pathJSON, JSON.stringify(bugs, null, 2), "utf8");
    return newBug;
  } catch (err) {
    throw new Error(
      `Failed to save bug report down to file block: ${err.message}`,
    );
  }
}

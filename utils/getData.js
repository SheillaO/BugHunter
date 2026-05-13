import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Fixed path: Step out of the utils folder, go into data, and read bugs.json
const pathJSON = path.join(__dirname, "..", "data", "bugs.json");

export async function getData() {
  try {
    const data = await fs.readFile(pathJSON, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        // Safe directory re-generation if Render clears the server folder structure
        await fs.mkdir(path.dirname(pathJSON), { recursive: true });
        await fs.writeFile(pathJSON, "[]", "utf8");
      } catch (mkdirErr) {
        console.error("Directory initialization failure:", mkdirErr.message);
      }
    } else {
      console.error("Warning: bugs.json could not be processed:", err.message);
    }
    return [];
  }
}

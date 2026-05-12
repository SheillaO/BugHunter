import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { addNewBug } from "../utils/addNewBug.js"; // CHANGED
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { bugEvents } from "../events/bugEvents.js"; // CHANGED
import { devNews } from "../data/devNews.js"; // CHANGED

export async function handleGet(res) {
  const data = await getData();
  const content = JSON.stringify(data);
  sendResponse(res, 200, "application/json", content);
}

export async function handlePost(req, res) {
  try {
    const parsedBody = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(parsedBody);
    await addNewBug(sanitizedBody); // CHANGED
    bugEvents.emit("bug-added", sanitizedBody); // CHANGED
    sendResponse(res, 201, "application/json", JSON.stringify(sanitizedBody));
  } catch (err) {
    sendResponse(res, 400, "application/json", JSON.stringify({ error: err }));
  }
}

export async function handleNews(req, res) {
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  setInterval(() => {
    let randomIndex = Math.floor(Math.random() * devNews.length); // CHANGED

    res.write(
      `data: ${JSON.stringify({
        event: "news-update",
        story: devNews[randomIndex], // CHANGED
      })}\n\n`,
    );
  }, 3000);
}

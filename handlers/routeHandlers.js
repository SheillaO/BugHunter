import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { addNewBug } from "../utils/addNewBug.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { bugEvents } from "../events/bugEvents.js";
import { devNews } from "../data/devNews.js";

export async function handleGet(res) {
  const data = await getData();
  const content = JSON.stringify(data);
  sendResponse(res, 200, "application/json", content);
}

export async function handlePost(req, res) {
  try {
    const parsedBody = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(parsedBody);

    sanitizedBody.status = sanitizedBody.status || "open";
    sanitizedBody.assignedTo = sanitizedBody.assignedTo || "Unassigned";

    await addNewBug(sanitizedBody);
    bugEvents.emit("bug-added", sanitizedBody);

    sendResponse(res, 201, "application/json", JSON.stringify(sanitizedBody));
  } catch (err) {
    sendResponse(
      res,
      400,
      "application/json",
      JSON.stringify({ error: err.message || err }),
    );
  }
}

export async function handleNews(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const newsInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * devNews.length);

    // Direct flat object string mapping to match frontend properties cleanly
    res.write(`data: ${JSON.stringify({ story: devNews[randomIndex] })}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(newsInterval);
    res.end();
  });
}

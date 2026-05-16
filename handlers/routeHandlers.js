import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { addNewBug } from "../utils/addNewBug.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { bugEvents } from "../events/bugEvents.js";
import { devNews } from "../data/devNews.js";

export async function handleGet(res) {
  try {
    const data = await getData();
    const content = JSON.stringify(data);
    sendResponse(res, 200, "application/json", content);
  } catch (err) {
    console.error("❌ GET BUGS ERROR:", err.message || err);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: "Failed to read database records" }),
    );
  }
}

export async function handlePost(req, res) {
  try {
    const parsedBody = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(parsedBody);

    sanitizedBody.status = sanitizedBody.status || "open";
    sanitizedBody.assignedTo = sanitizedBody.assignedTo || "Unassigned";

    sanitizedBody.text =
      sanitizedBody.text || sanitizedBody.details || "No description provided.";

    await addNewBug(sanitizedBody);
    bugEvents.emit("bug-added", sanitizedBody);

    sendResponse(res, 201, "application/json", JSON.stringify(sanitizedBody));
  } catch (err) {
    console.error("❌ CRITICAL SUBMISSION FAILURE:", err.message || err);
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
    res.write(`data: ${JSON.stringify({ story: devNews[randomIndex] })}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(newsInterval);
    res.end();
  });
}

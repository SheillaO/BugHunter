import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { addNewBug } from "../utils/addNewBug.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { bugEvents } from "../events/bugEvents.js";
import { devNews } from "../data/devNews.js";

// Handle GET requests to fetch the complete bug repository array
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

// Handle POST requests to process, validate, and record inbound tracking forms
export async function handlePost(req, res) {
  try {
    // 1. Stream input buffer blocks and map them cleanly to a JavaScript object instance
    const parsedBody = await parseJSONBody(req);

    // 2. Strip potentially malicious script execution tags out of input values
    const sanitizedBody = sanitizeInput(parsedBody);

    // 3. Guarantee baseline metadata structure keys populate reliably for user card renders
    sanitizedBody.status = sanitizedBody.status || "open";
    sanitizedBody.assignedTo = sanitizedBody.assignedTo || "Unassigned";

    // 4. Append log entry onto your data tracking file array
    await addNewBug(sanitizedBody);

    // 5. Fire global event lifecycle emitter hooks (Dispatches Slack Console logs)
    bugEvents.emit("bug-added", sanitizedBody);

    sendResponse(res, 201, "application/json", JSON.stringify(sanitizedBody));
  } catch (err) {
    // Crucial: Outputs explicit crash telemetry string straight to Render console windows
    console.error("❌ CRITICAL SUBMISSION FAILURE:", err.message || err);

    sendResponse(
      res,
      400,
      "application/json",
      JSON.stringify({ error: err.message || err }),
    );
  }
}

// Handle live Server-Sent Events streams to feed updates into your layout containers
export async function handleNews(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Broadcast data payload metrics down to client browsers every 3 seconds
  const newsInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * devNews.length);
    res.write(`data: ${JSON.stringify({ story: devNews[randomIndex] })}\n\n`);
  }, 3000);

  // Clear running background interval loops immediately if users disconnect or exit tabs
  req.on("close", () => {
    clearInterval(newsInterval);
    res.end();
  });
}

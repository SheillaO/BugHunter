import http from "node:http";
import { serveStatic } from "./utils/serveStatic.js";
import { handleGet, handlePost, handleNews } from "./handlers/routeHandlers.js";

const PORT = process.env.PORT || 8000;
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.url === "/api") {
    if (req.method === "GET") {
      return await handleGet(res);
    } else if (req.method === "POST") {
      return await handlePost(req, res);
    }
  } else if (req.url === "/api/news") {
    return await handleNews(req, res);
  } else {
    return await serveStatic(req, res, __dirname);
  }
});

server.listen(PORT, () =>
  console.log(
    `🚀 BugHunter Server processing transactions smoothly on Port: ${PORT}`,
  ),
);

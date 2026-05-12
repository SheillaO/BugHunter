import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { handleGet, handlePost, handleNews } from './handlers/routeHandlers.js'

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

    if (req.url === '/api/bugs') {
  if (req.method === 'GET') {
    return await handleGetBugs(res)
  }
  else if (req.method === 'POST') {
    return await handleReportBug(req, res)
  }
}

else if (req.url === '/api/dev-news') {
  return await handleDevNews(req, res)
}

{

        return await serveStatic(req, res, __dirname)

    }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))

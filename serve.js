const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(".");
const port = 8000;
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(root, url === "/" ? "index.html" : url);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.stat(file, (err, stat) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    if (stat.isDirectory()) file = path.join(file, "index.html");
    const ext = path.extname(file).toLowerCase();
    const map = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.json': 'application/json'
    };
    fs.readFile(file, (e, data) => {
      if (e) {
        res.writeHead(500);
        return res.end("Server error");
      }
      res.writeHead(200, { 'Content-Type': map[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(port, () => console.log(`Serving at http://localhost:${port}`));

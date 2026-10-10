const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const apiHandler = require('./api/index');
const { getDatabaseInfo } = require('./lib/db');

const PORT = process.env.PORT || 2026;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ── ROUTE API CALLS TO SERVERLESS HANDLER ──
  if (pathname.startsWith('/api/') || pathname === '/api') {
    return apiHandler(req, res);
  }

  // ── ROUTE /admin TO admin.html & /product TO product.html ──
  let cleanPath = pathname;
  if (cleanPath === '/' || cleanPath === '') {
    cleanPath = '/index.html';
  } else if (cleanPath === '/admin' || cleanPath === '/admin/') {
    cleanPath = '/admin.html';
  } else if (cleanPath === '/product' || cleanPath === '/product/') {
    cleanPath = '/product.html';
  }

  let filePath = path.join(ROOT_DIR, 'public', decodeURIComponent(cleanPath));
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT_DIR, decodeURIComponent(cleanPath));
  }

  // Security check: ensure path stays within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback for non-API routes
      const fallbackPath = path.join(ROOT_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  const dbInfo = await getDatabaseInfo();
  console.log(`===============================================`);
  console.log(` 21 — TWENTY ONE CLOTHING SERVER IS LIVE! 🚀`);
  console.log(` Storefront:  http://localhost:${PORT}`);
  console.log(` Admin Panel: http://localhost:${PORT}/admin`);
  console.log(` Database:    ${dbInfo.type} (${dbInfo.name})`);
  console.log(` Status:      ${dbInfo.mode}`);
  console.log(`===============================================`);
});

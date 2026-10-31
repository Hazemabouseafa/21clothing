const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');
const apiHandler = require('./api/index');
const { getDatabaseInfo, closeLocalDb, DATA_DIR } = require('./lib/db');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt']);

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  // ── HEALTHCHECK SHORTCUT FOR REVERSE PROXIES / COOLIFY ──
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, uptime: Math.round(process.uptime()) }));
  }

  // ── ROUTE API CALLS TO HANDLER ──
  if (pathname.startsWith('/api/') || pathname === '/api') {
    return apiHandler(req, res);
  }

  // ── CLEAN URL ROUTING (/admin & /product) ──
  let cleanPath = pathname;
  if (cleanPath === '/' || cleanPath === '') {
    cleanPath = '/index.html';
  } else if (cleanPath === '/admin' || cleanPath === '/admin/') {
    cleanPath = '/admin.html';
  } else if (cleanPath === '/product' || cleanPath === '/product/') {
    cleanPath = '/product.html';
  }

  let safeDecoded;
  try {
    safeDecoded = decodeURIComponent(cleanPath);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad Request');
  }

  // Prevent access to sensitive internal directories
  const normalizedRel = path.normalize(safeDecoded).replace(/^(\.\.(\/|\\|$))+/, '');
  if (
    normalizedRel.startsWith('/data') ||
    normalizedRel.startsWith('\\data') ||
    normalizedRel.startsWith('/seed_data') ||
    normalizedRel.startsWith('\\seed_data') ||
    normalizedRel.startsWith('/lib') ||
    normalizedRel.startsWith('\\lib') ||
    normalizedRel.includes('.sqlite') ||
    normalizedRel.includes('.env')
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  let filePath = path.join(ROOT_DIR, 'public', normalizedRel);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT_DIR, normalizedRel);
  }

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(ROOT_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not Found');
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtmlOrJs = ext === '.html' || ext === '.js' || ext === '.json';
    const cacheHeader = isHtmlOrJs
      ? 'public, max-age=0, must-revalidate'
      : 'public, max-age=604800, immutable';

    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheHeader
    };

    const acceptEncoding = (req.headers && req.headers['accept-encoding']) || '';
    if (COMPRESSIBLE_EXTS.has(ext) && stats.size > 1024 && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
      return;
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(PORT, HOST, async () => {
  const dbInfo = await getDatabaseInfo();
  console.log(`=======================================================`);
  console.log(` 21 — TWENTY ONE CLOTHING VPS SERVER IS LIVE! 🚀`);
  console.log(` Storefront:  http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(` Admin Panel: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/admin`);
  console.log(` Database:    ${dbInfo.type}`);
  console.log(` Data Dir:    ${DATA_DIR}`);
  console.log(` Status:      ${dbInfo.mode}`);
  console.log(`=======================================================`);
});

function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Closing server and flushing local SQLite DB...`);
  server.close(() => {
    closeLocalDb();
    console.log('[Server] Clean shutdown complete.');
    process.exit(0);
  });
  setTimeout(() => {
    closeLocalDb();
    process.exit(0);
  }, 5000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

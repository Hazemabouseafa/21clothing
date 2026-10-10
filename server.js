const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 2026;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  promos: path.join(DATA_DIR, 'promos.json'),
  shipping: path.join(DATA_DIR, 'shipping.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  content: path.join(DATA_DIR, 'content.json')
};

const DEFAULTS = {
  products: [
    {
      id: 1,
      name: "Midnight Drop Hoodie",
      price: 1250,
      originalPrice: 1450,
      badge: "New Drop",
      fit: "Oversized Fit 450 GSM",
      colorTheme: "black",
      colors: ["#0a0a0a", "#1a1a2e", "#2d1b1b"],
      svgFill: "#1c1c1c",
      accent: "#3a3a3a",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 8, M: 14, L: 20, XL: 12, XXL: 5 },
      desc: "100% Egyptian Cotton, ultra-dense 450 GSM French Terry, double-layered hood with brushed 21 insignia.",
      active: true
    },
    {
      id: 2,
      name: "Ash Classic Hoodie",
      price: 1150,
      originalPrice: 1300,
      badge: "Bestseller",
      fit: "Relaxed Fit 420 GSM",
      colorTheme: "ash",
      colors: ["#666666", "#888888", "#444444"],
      svgFill: "#4a4a4a",
      accent: "#888888",
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 12, M: 18, L: 15, XL: 10, XXL: 4 },
      desc: "Custom washed ash fleece with dropped shoulders, kangaroo pocket, and hidden cuff embroidery.",
      active: true
    },
    {
      id: 3,
      name: "Stone Desert Oversized",
      price: 1350,
      originalPrice: 1600,
      badge: "Limited",
      fit: "Boxy Heavyweight 480 GSM",
      colorTheme: "stone",
      colors: ["#c8b89a", "#d4c5ae", "#e0d5c0"],
      svgFill: "#3d3530",
      accent: "#5a4f46",
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 5, M: 9, L: 11, XL: 6, XXL: 2 },
      desc: "Earthy Egyptian desert hue, tailored boxy cut, ribbed hems with heavy raw cotton weight.",
      active: true
    },
    {
      id: 4,
      name: "Chalk Essential Hoodie",
      price: 1100,
      originalPrice: 1250,
      badge: "",
      fit: "Regular Streetwear 400 GSM",
      colorTheme: "chalk",
      colors: ["#e8e3d8", "#f0ece2", "#d4cfc4"],
      svgFill: "#6a6a6a",
      accent: "#999999",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 10, M: 15, L: 12, XL: 8, XXL: 4 },
      desc: "Clean off-white minimalism. Subtle tonal 21 screen-print, buttery soft brushed inner lining.",
      active: true
    },
    {
      id: 5,
      name: "Ink Heavyweight Zip-Up",
      price: 1450,
      originalPrice: 1700,
      badge: "New Drop",
      fit: "Heavy Zip 500 GSM",
      colorTheme: "ink",
      colors: ["#111111", "#1a1a1a", "#000000"],
      svgFill: "#2a2a2a",
      accent: "#555555",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 6, M: 12, L: 16, XL: 10, XXL: 3 },
      desc: "Double-way matte silver metal zipper, premium heavyweight Egyptian yarn, engineered box hood.",
      active: true
    },
    {
      id: 6,
      name: "Fog Relaxed Hoodie",
      price: 1200,
      originalPrice: 1350,
      badge: "",
      fit: "Oversized Fit 420 GSM",
      colorTheme: "ash",
      colors: ["#b0aaa0", "#c0bab0", "#a0a09a"],
      svgFill: "#3d3d3d",
      accent: "#666666",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      sizes: { S: 9, M: 14, L: 17, XL: 7, XXL: 3 },
      desc: "Subtle muted fog tone, seamless shoulder drop, vintage garment dyed finish.",
      active: true
    }
  ],
  orders: [
    {
      id: "21-1048",
      date: "2026-10-09 14:22",
      customer: "Karim El-Sayed",
      phone: "01012345678",
      governorate: "Cairo",
      address: "Zamalek, Brazil St, Bldg 14, Apt 6",
      items: [
        { id: 1, name: "Midnight Drop Hoodie", size: "L", color: "#0a0a0a", qty: 1, price: 1250 }
      ],
      subtotal: 1250,
      shipping: 50,
      discount: 0,
      total: 1300,
      payment: "Cash on Delivery",
      status: "pending"
    },
    {
      id: "21-1047",
      date: "2026-10-09 11:15",
      customer: "Nouran Mansour",
      phone: "01123456789",
      governorate: "Giza",
      address: "Sheikh Zayed, District 7, Villa 22",
      items: [
        { id: 3, name: "Stone Desert Oversized", size: "M", color: "#c8b89a", qty: 1, price: 1350 },
        { id: 4, name: "Chalk Essential Hoodie", size: "S", color: "#e8e3d8", qty: 1, price: 1100 }
      ],
      subtotal: 2450,
      shipping: 0,
      discount: 100,
      total: 2350,
      payment: "Instapay",
      status: "confirmed"
    },
    {
      id: "21-1046",
      date: "2026-10-08 19:40",
      customer: "Omar Tarek",
      phone: "01234567890",
      governorate: "Alexandria",
      address: "Smouha, Victor Emmanuel Square, Apt 4B",
      items: [
        { id: 5, name: "Ink Heavyweight Zip-Up", size: "XL", color: "#111111", qty: 1, price: 1450 }
      ],
      subtotal: 1450,
      shipping: 65,
      discount: 0,
      total: 1515,
      payment: "Vodafone Cash",
      status: "shipped"
    }
  ],
  promos: [
    { code: "TWENTY21", type: "percentage", value: 10, min: 1000, used: 24, active: true },
    { code: "CAIRODROP", type: "fixed", value: 150, min: 1500, used: 12, active: true },
    { code: "FREESHIP", type: "fixed", value: 50, min: 2000, used: 8, active: true }
  ],
  shipping: {
    cairo: 50,
    alex: 65,
    delta: 70,
    upperEgypt: 85,
    freeThreshold: 2500
  },
  settings: {
    waNumber: "201012345678",
    announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
    showAnnouncement: "true",
    storeStatus: "open",
    metaPixel: ""
  },
  content: {
    announcement: "FREE SHIPPING ON ORDERS OVER 2,500 EGP | CASH ON DELIVERY ACROSS EGYPT",
    heroTagline: "Cairo Streetwear Essentials — Drop 001",
    heroCta: "Shop The Collection",
    marqueeItems: "Twenty One Clothing ✦ 450 GSM French Terry ✦ Cairo, Egypt ✦ Drop 001 ✦ Heavyweight Hoodies ✦ Limited Quantities",
    collectionEyebrow: "Winter Essentials",
    collectionTitle: "Drop 001\nThe Hoodies",
    storyEyebrow: "The Philosophy",
    storyTitle: "Built for the\nstreets of Cairo.",
    storyParagraph1: "Twenty One was born out of an obsession with the uncompromising hoodie. Engineered with ultra-heavyweight 450 GSM Egyptian combed cotton, bespoke garment dye, and an architectural drop-shoulder cut.",
    storyParagraph2: "No loud noise. No oversized slogans. Just silhouette and weight that speak.",
    footerDesc: "Cairo, Egypt\nIndependent Streetwear Label.\nDesigned and crafted locally.",
    footerCopyright: "© 2026 Twenty One Clothing. All Rights Reserved."
  }
};

function readData(key) {
  const filePath = FILES[key];
  if (!fs.existsSync(filePath)) {
    writeData(key, DEFAULTS[key]);
    return DEFAULTS[key];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return DEFAULTS[key];
  }
}

function writeData(key, data) {
  fs.writeFileSync(FILES[key], JSON.stringify(data, null, 2), 'utf8');
}

Object.keys(DEFAULTS).forEach(key => {
  if (!fs.existsSync(FILES[key])) {
    writeData(key, DEFAULTS[key]);
  }
});
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

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 15 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ── REST API ROUTES ──
  if (pathname.startsWith('/api/')) {
    try {
      // /api/products
      if (pathname === '/api/products') {
        let products = readData('products');
        if (method === 'GET') return sendJson(res, 200, products);
        if (method === 'POST') {
          const body = await parseBody(req);
          const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
          const newProduct = { id: newId, ...body, active: true };
          products.push(newProduct);
          writeData('products', products);
          return sendJson(res, 201, newProduct);
        }
        if (method === 'PUT') {
          const body = await parseBody(req);
          if (Array.isArray(body)) {
            writeData('products', body);
            return sendJson(res, 200, body);
          }
        }
      }

      // /api/products/:id
      const prodMatch = pathname.match(/^\/api\/products\/(\d+)$/);
      if (prodMatch) {
        const id = Number(prodMatch[1]);
        let products = readData('products');
        const idx = products.findIndex(p => p.id === id);

        if (idx === -1) return sendJson(res, 404, { error: 'Product not found' });

        if (method === 'PUT') {
          const body = await parseBody(req);
          products[idx] = { ...products[idx], ...body, id };
          writeData('products', products);
          return sendJson(res, 200, products[idx]);
        }
        if (method === 'DELETE') {
          products.splice(idx, 1);
          writeData('products', products);
          return sendJson(res, 200, { success: true });
        }
      }

      // /api/orders
      if (pathname === '/api/orders') {
        let orders = readData('orders');
        if (method === 'GET') return sendJson(res, 200, orders);
        if (method === 'POST') {
          const body = await parseBody(req);
          const orderId = body.id || ('21-' + Math.floor(1000 + Math.random() * 9000));
          const newOrder = {
            id: orderId,
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'pending',
            ...body
          };
          orders.unshift(newOrder);
          writeData('orders', orders);

          if (newOrder.items && newOrder.items.length) {
            let products = readData('products');
            newOrder.items.forEach(item => {
              const p = products.find(x => x.id === item.id);
              if (p && p.sizes && p.sizes[item.size] !== undefined) {
                p.sizes[item.size] = Math.max(0, p.sizes[item.size] - item.qty);
              }
            });
            writeData('products', products);
          }

          return sendJson(res, 201, newOrder);
        }
        if (method === 'PUT') {
          const body = await parseBody(req);
          if (Array.isArray(body)) {
            writeData('orders', body);
            return sendJson(res, 200, body);
          }
        }
      }

      // /api/orders/:id
      const orderMatch = pathname.match(/^\/api\/orders\/([a-zA-Z0-9_-]+)$/);
      if (orderMatch) {
        const id = orderMatch[1];
        let orders = readData('orders');
        const idx = orders.findIndex(o => o.id === id);

        if (idx === -1) return sendJson(res, 404, { error: 'Order not found' });

        if (method === 'PUT') {
          const body = await parseBody(req);
          orders[idx] = { ...orders[idx], ...body };
          writeData('orders', orders);
          return sendJson(res, 200, orders[idx]);
        }
        if (method === 'DELETE') {
          orders.splice(idx, 1);
          writeData('orders', orders);
          return sendJson(res, 200, { success: true });
        }
      }

      // /api/content (Custom Storefront Texts)
      if (pathname === '/api/content') {
        if (method === 'GET') return sendJson(res, 200, readData('content'));
        if (method === 'POST' || method === 'PUT') {
          const body = await parseBody(req);
          const current = readData('content');
          const updated = { ...current, ...body };
          writeData('content', updated);
          return sendJson(res, 200, updated);
        }
      }

      // /api/promos
      if (pathname === '/api/promos') {
        if (method === 'GET') return sendJson(res, 200, readData('promos'));
        if (method === 'POST' || method === 'PUT') {
          const body = await parseBody(req);
          writeData('promos', body);
          return sendJson(res, 200, body);
        }
      }

      // /api/shipping
      if (pathname === '/api/shipping') {
        if (method === 'GET') return sendJson(res, 200, readData('shipping'));
        if (method === 'POST' || method === 'PUT') {
          const body = await parseBody(req);
          writeData('shipping', body);
          return sendJson(res, 200, body);
        }
      }

      // /api/settings
      if (pathname === '/api/settings') {
        if (method === 'GET') return sendJson(res, 200, readData('settings'));
        if (method === 'POST' || method === 'PUT') {
          const body = await parseBody(req);
          writeData('settings', body);
          return sendJson(res, 200, body);
        }
      }

      // /api/reset
      if (pathname === '/api/reset' && method === 'POST') {
        Object.keys(DEFAULTS).forEach(key => writeData(key, DEFAULTS[key]));
        return sendJson(res, 200, { success: true, message: 'Reset to sample data' });
      }

      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ── STATIC FILE SERVING ──
  let filePath = pathname === '/' ? 'index.html' : pathname;
  if (filePath === '/admin') filePath = 'admin.html';
  filePath = path.join(ROOT_DIR, decodeURIComponent(filePath));

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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` 21 — TWENTY ONE CLOTHING SERVER IS LIVE! 🚀`);
  console.log(` Storefront:  http://localhost:${PORT}`);
  console.log(` Admin Panel: http://localhost:${PORT}/admin`);
  console.log(` Port:        ${PORT}`);
  console.log(`===============================================`);
});

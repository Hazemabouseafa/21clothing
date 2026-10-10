const url = require('url');
const {
  getStoreData,
  setStoreData,
  resetStoreData,
  getDatabaseInfo,
  isNeonActive
} = require('../lib/db');

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  // Normalize pathname: remove trailing slash if any (except root)
  let pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    return res.end();
  }

  try {
    // ── /api/products ──
    if (pathname === '/api/products') {
      let products = await getStoreData('products');
      if (method === 'GET') return sendJson(res, 200, products);

      if (method === 'POST') {
        const body = await parseBody(req);
        const newId = products.length ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
        const newProduct = { id: newId, ...body, active: true };
        products.push(newProduct);
        await setStoreData('products', products);
        return sendJson(res, 201, newProduct);
      }

      if (method === 'PUT') {
        const body = await parseBody(req);
        if (Array.isArray(body)) {
          await setStoreData('products', body);
          return sendJson(res, 200, body);
        } else if (body && body.id) {
          const idx = products.findIndex(p => Number(p.id) === Number(body.id));
          if (idx !== -1) {
            products[idx] = { ...products[idx], ...body, id: Number(body.id) };
            await setStoreData('products', products);
            return sendJson(res, 200, products[idx]);
          } else {
            return sendJson(res, 404, { error: 'Product not found' });
          }
        }
      }

      if (method === 'DELETE') {
        const idToDelete = parsedUrl.query && parsedUrl.query.id;
        if (idToDelete) {
          const idx = products.findIndex(p => Number(p.id) === Number(idToDelete));
          if (idx !== -1) {
            products.splice(idx, 1);
            await setStoreData('products', products);
            return sendJson(res, 200, { success: true });
          }
          return sendJson(res, 404, { error: 'Product not found' });
        }
      }
    }

    // ── /api/products/:id ──
    const prodMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (prodMatch) {
      const id = Number(prodMatch[1]);
      let products = await getStoreData('products');
      const idx = products.findIndex(p => p.id === id);

      if (idx === -1) return sendJson(res, 404, { error: 'Product not found' });

      if (method === 'GET') {
        return sendJson(res, 200, products[idx]);
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        products[idx] = { ...products[idx], ...body, id };
        await setStoreData('products', products);
        return sendJson(res, 200, products[idx]);
      }
      if (method === 'DELETE') {
        products.splice(idx, 1);
        await setStoreData('products', products);
        return sendJson(res, 200, { success: true });
      }
    }

    // ── /api/orders ──
    if (pathname === '/api/orders') {
      let orders = await getStoreData('orders');
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
        await setStoreData('orders', orders);

        // Auto decrement stock
        if (newOrder.items && newOrder.items.length) {
          let products = await getStoreData('products');
          newOrder.items.forEach(item => {
            const p = products.find(x => x.id === item.id);
            if (p && p.sizes && p.sizes[item.size] !== undefined) {
              p.sizes[item.size] = Math.max(0, p.sizes[item.size] - item.qty);
            }
          });
          await setStoreData('products', products);
        }

        return sendJson(res, 201, newOrder);
      }

      if (method === 'PUT') {
        const body = await parseBody(req);
        if (Array.isArray(body)) {
          await setStoreData('orders', body);
          return sendJson(res, 200, body);
        } else if (body && body.id) {
          const idx = orders.findIndex(o => String(o.id) === String(body.id));
          if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...body, id: body.id };
            await setStoreData('orders', orders);
            return sendJson(res, 200, { success: true, order: orders[idx] });
          } else {
            return sendJson(res, 404, { error: 'Order not found' });
          }
        }
      }

      if (method === 'DELETE') {
        const idToDelete = parsedUrl.query && parsedUrl.query.id;
        if (idToDelete) {
          const idx = orders.findIndex(o => String(o.id) === String(idToDelete));
          if (idx !== -1) {
            orders.splice(idx, 1);
            await setStoreData('orders', orders);
            return sendJson(res, 200, { success: true });
          }
          return sendJson(res, 404, { error: 'Order not found' });
        }
      }
    }

    // ── /api/orders/:id ──
    const orderMatch = pathname.match(/^\/api\/orders\/([a-zA-Z0-9_-]+)$/);
    if (orderMatch) {
      const id = orderMatch[1];
      let orders = await getStoreData('orders');
      const idx = orders.findIndex(o => String(o.id) === String(id));

      if (idx === -1) return sendJson(res, 404, { error: 'Order not found' });

      if (method === 'GET') {
        return sendJson(res, 200, orders[idx]);
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        orders[idx] = { ...orders[idx], ...body, id };
        await setStoreData('orders', orders);
        return sendJson(res, 200, { success: true, order: orders[idx] });
      }
      if (method === 'DELETE') {
        orders.splice(idx, 1);
        await setStoreData('orders', orders);
        return sendJson(res, 200, { success: true });
      }
    }

    // ── /api/content ──
    if (pathname === '/api/content') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('content'));
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        const current = await getStoreData('content');
        const updated = { ...current, ...body };
        await setStoreData('content', updated);
        return sendJson(res, 200, updated);
      }
    }

    // ── /api/promos ──
    if (pathname === '/api/promos') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('promos'));
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('promos', body);
        return sendJson(res, 200, body);
      }
    }

    // ── /api/shipping ──
    if (pathname === '/api/shipping') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('shipping'));
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('shipping', body);
        return sendJson(res, 200, body);
      }
    }

    // ── /api/settings ──
    if (pathname === '/api/settings') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('settings'));
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('settings', body);
        return sendJson(res, 200, body);
      }
    }

    // ── /api/size-guides ──
    if (pathname === '/api/size-guides') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('sizeGuides'));
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('sizeGuides', body);
        return sendJson(res, 200, body);
      }
    }

    // ── /api/auth/login ──
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const settings = await getStoreData('settings');
      const validUser = (settings && settings.adminUser) || 'admin';
      const validPass = (settings && settings.adminPass) || 'twenty21';

      if (body.username === validUser && body.password === validPass) {
        return sendJson(res, 200, {
          success: true,
          token: '21_auth_' + Buffer.from(validUser + ':' + Date.now()).toString('base64'),
          user: validUser
        });
      } else {
        return sendJson(res, 401, {
          success: false,
          error: 'Invalid username or password'
        });
      }
    }

    // ── /api/reset ──
    if (pathname === '/api/reset' && method === 'POST') {
      await resetStoreData();
      return sendJson(res, 200, { success: true, message: 'All store data reset to official defaults' });
    }

    // ── /api/status (Live Neon Database & System Diagnostics) ──
    if (pathname === '/api/status' || pathname === '/api/health') {
      const dbInfo = getDatabaseInfo();
      const prods = await getStoreData('products');
      const orders = await getStoreData('orders');
      return sendJson(res, 200, {
        status: 'online',
        service: '21 Clothing API (Vercel Serverless)',
        database: dbInfo,
        stats: {
          productsCount: prods.length,
          ordersCount: orders.length
        },
        timestamp: new Date().toISOString()
      });
    }

    return sendJson(res, 404, { error: 'API endpoint not found', path: pathname });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: err.message });
  }
};

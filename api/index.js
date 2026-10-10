const url = require('url');
const {
  getStoreData,
  setStoreData,
  resetStoreData,
  syncAllToNeon,
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

function sendJson(res, statusCode, data, req) {
  const isCloud = isNeonActive(req);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-database-url, x-db-url',
    'Access-Control-Expose-Headers': 'x-db-connected, x-db-type',
    'x-db-connected': isCloud ? 'true' : 'false',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-database-url, x-db-url'
    });
    return res.end();
  }

  try {
    // ── /api/products ──
    if (pathname === '/api/products') {
      let products = await getStoreData('products', undefined, req);
      if (method === 'GET') return sendJson(res, 200, products, req);

      if (method === 'POST') {
        const body = await parseBody(req);
        const newId = products.length ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
        const newSortOrder = products.length ? Math.max(...products.map(p => Number(p.sortOrder) || 0)) + 1 : 1;
        const newProduct = { id: newId, sortOrder: newSortOrder, ...body, active: true };
        products.push(newProduct);
        await setStoreData('products', products, req);
        return sendJson(res, 201, newProduct, req);
      }

      if (method === 'PUT') {
        const body = await parseBody(req);
        if (Array.isArray(body)) {
          await setStoreData('products', body, req);
          return sendJson(res, 200, body, req);
        } else if (body && body.id) {
          const idx = products.findIndex(p => Number(p.id) === Number(body.id));
          if (idx !== -1) {
            products[idx] = { ...products[idx], ...body, id: Number(body.id) };
            await setStoreData('products', products, req);
            return sendJson(res, 200, products[idx], req);
          } else {
            return sendJson(res, 404, { error: 'Product not found' }, req);
          }
        }
      }

      if (method === 'DELETE') {
        const idToDelete = parsedUrl.query && parsedUrl.query.id;
        if (idToDelete) {
          const idx = products.findIndex(p => Number(p.id) === Number(idToDelete));
          if (idx !== -1) {
            products.splice(idx, 1);
            await setStoreData('products', products, req);
            return sendJson(res, 200, { success: true }, req);
          }
          return sendJson(res, 404, { error: 'Product not found' }, req);
        }
      }
    }

    // ── /api/products/:id ──
    const prodMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (prodMatch) {
      const id = Number(prodMatch[1]);
      let products = await getStoreData('products', undefined, req);
      const idx = products.findIndex(p => p.id === id);

      if (idx === -1) return sendJson(res, 404, { error: 'Product not found' }, req);

      if (method === 'GET') {
        return sendJson(res, 200, products[idx], req);
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        products[idx] = { ...products[idx], ...body, id };
        await setStoreData('products', products, req);
        return sendJson(res, 200, products[idx], req);
      }
      if (method === 'DELETE') {
        products.splice(idx, 1);
        await setStoreData('products', products, req);
        return sendJson(res, 200, { success: true }, req);
      }
    }

    // ── /api/orders ──
    if (pathname === '/api/orders') {
      let orders = await getStoreData('orders', undefined, req);
      if (method === 'GET') return sendJson(res, 200, orders, req);

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
        await setStoreData('orders', orders, req);

        // Auto decrement stock
        if (newOrder.items && newOrder.items.length) {
          let products = await getStoreData('products', undefined, req);
          newOrder.items.forEach(item => {
            const p = products.find(x => x.id === item.id);
            if (p && p.sizes && p.sizes[item.size] !== undefined) {
              p.sizes[item.size] = Math.max(0, p.sizes[item.size] - item.qty);
            }
          });
          await setStoreData('products', products, req);
        }

        return sendJson(res, 201, newOrder, req);
      }

      if (method === 'PUT') {
        const body = await parseBody(req);
        if (Array.isArray(body)) {
          await setStoreData('orders', body, req);
          return sendJson(res, 200, body, req);
        } else if (body && body.id) {
          const idx = orders.findIndex(o => String(o.id) === String(body.id));
          if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...body, id: body.id };
            await setStoreData('orders', orders, req);
            return sendJson(res, 200, { success: true, order: orders[idx] }, req);
          } else {
            return sendJson(res, 404, { error: 'Order not found' }, req);
          }
        }
      }

      if (method === 'DELETE') {
        const idToDelete = parsedUrl.query && parsedUrl.query.id;
        if (idToDelete) {
          const idx = orders.findIndex(o => String(o.id) === String(idToDelete));
          if (idx !== -1) {
            orders.splice(idx, 1);
            await setStoreData('orders', orders, req);
            return sendJson(res, 200, { success: true }, req);
          }
          return sendJson(res, 404, { error: 'Order not found' }, req);
        }
      }
    }

    // ── /api/orders/:id ──
    const orderMatch = pathname.match(/^\/api\/orders\/([a-zA-Z0-9_-]+)$/);
    if (orderMatch) {
      const id = orderMatch[1];
      let orders = await getStoreData('orders', undefined, req);
      const idx = orders.findIndex(o => String(o.id) === String(id));

      if (idx === -1) return sendJson(res, 404, { error: 'Order not found' }, req);

      if (method === 'GET') {
        return sendJson(res, 200, orders[idx], req);
      }
      if (method === 'PUT') {
        const body = await parseBody(req);
        orders[idx] = { ...orders[idx], ...body, id };
        await setStoreData('orders', orders, req);
        return sendJson(res, 200, { success: true, order: orders[idx] }, req);
      }
      if (method === 'DELETE') {
        orders.splice(idx, 1);
        await setStoreData('orders', orders, req);
        return sendJson(res, 200, { success: true }, req);
      }
    }

    // ── /api/content ──
    if (pathname === '/api/content') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('content', undefined, req), req);
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        const current = await getStoreData('content', undefined, req);
        const updated = { ...current, ...body };
        await setStoreData('content', updated, req);
        return sendJson(res, 200, updated, req);
      }
    }

    // ── /api/promos ──
    if (pathname === '/api/promos') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('promos', undefined, req), req);
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('promos', body, req);
        return sendJson(res, 200, body, req);
      }
    }

    // ── /api/shipping ──
    if (pathname === '/api/shipping') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('shipping', undefined, req), req);
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('shipping', body, req);
        return sendJson(res, 200, body, req);
      }
    }

    // ── /api/settings ──
    if (pathname === '/api/settings') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('settings', undefined, req), req);
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('settings', body, req);
        return sendJson(res, 200, body, req);
      }
    }

    // ── /api/size-guides ──
    if (pathname === '/api/size-guides') {
      if (method === 'GET') return sendJson(res, 200, await getStoreData('sizeGuides', undefined, req), req);
      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        await setStoreData('sizeGuides', body, req);
        return sendJson(res, 200, body, req);
      }
    }

    // ── /api/auth/login ──
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const settings = await getStoreData('settings', undefined, req);
      const validUser = (settings && settings.adminUser) || 'admin';
      const validPass = (settings && settings.adminPass) || 'twenty21';

      if (body.username === validUser && body.password === validPass) {
        return sendJson(res, 200, {
          success: true,
          token: '21_auth_' + Buffer.from(validUser + ':' + Date.now()).toString('base64'),
          user: validUser
        }, req);
      } else {
        return sendJson(res, 401, {
          success: false,
          error: 'Invalid username or password'
        }, req);
      }
    }

    // ── /api/neon-sync (Bulk Cloud Synchronization) ──
    if (pathname === '/api/neon-sync' && method === 'POST') {
      const body = await parseBody(req);
      try {
        const result = await syncAllToNeon(body, req);
        return sendJson(res, 200, result, req);
      } catch (syncErr) {
        return sendJson(res, 400, { success: false, error: syncErr.message }, req);
      }
    }

    // ── /api/reset ──
    if (pathname === '/api/reset' && method === 'POST') {
      await resetStoreData(req);
      return sendJson(res, 200, { success: true, message: 'All store data reset to official defaults' }, req);
    }

    // ── /api/status (Live Neon Database & System Diagnostics) ──
    if (pathname === '/api/status' || pathname === '/api/health') {
      const dbInfo = await getDatabaseInfo(req);
      const prods = await getStoreData('products', undefined, req);
      const orders = await getStoreData('orders', undefined, req);
      return sendJson(res, 200, {
        status: 'online',
        service: '21 Clothing API (Vercel Serverless)',
        database: dbInfo,
        stats: {
          productsCount: prods.length,
          ordersCount: orders.length
        },
        timestamp: new Date().toISOString()
      }, req);
    }

    return sendJson(res, 404, { error: 'API endpoint not found', path: pathname }, req);
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: err.message }, req);
  }
};

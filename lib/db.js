const fs = require('fs');
const path = require('path');
const { DEFAULTS } = require('./defaults');

// Attempt to load .env in development/local environments
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile(envPath);
    } else {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  }
} catch (e) {
  // Silent catch
}

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  promos: path.join(DATA_DIR, 'promos.json'),
  shipping: path.join(DATA_DIR, 'shipping.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  content: path.join(DATA_DIR, 'content.json'),
  sizeGuides: path.join(DATA_DIR, 'size-guides.json')
};

const neonClients = new Map();
const tablesInitializedMap = new Map();

function getDbUrl(reqOrUrl) {
  if (typeof reqOrUrl === 'string' && reqOrUrl.trim()) {
    return reqOrUrl.trim();
  }
  if (reqOrUrl && reqOrUrl.headers) {
    const headerUrl = reqOrUrl.headers['x-database-url'] || reqOrUrl.headers['x-db-url'];
    if (headerUrl && typeof headerUrl === 'string' && headerUrl.trim()) {
      return headerUrl.trim();
    }
  }

  // Check all known Vercel Storage / Postgres / Neon environment variables
  const envUrl = process.env.DATABASE_URL ||
                 process.env.POSTGRES_URL ||
                 process.env.POSTGRES_PRISMA_URL ||
                 process.env.POSTGRES_URL_NON_POOLING ||
                 process.env.NEON_DATABASE_URL ||
                 process.env.DATABASE_URL_UNPOOLED ||
                 process.env.STORAGE_POSTGRES_URL ||
                 process.env.VERCEL_POSTGRES_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let url = envUrl.trim();
    // Ensure sslmode=require for Neon serverless connections if not specified
    if (url.includes('neon.tech') && !url.includes('sslmode=')) {
      url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    return url;
  }

  // Support discrete Vercel Postgres environment variables
  if (process.env.POSTGRES_HOST && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD) {
    const user = encodeURIComponent(process.env.POSTGRES_USER);
    const pass = encodeURIComponent(process.env.POSTGRES_PASSWORD);
    const host = process.env.POSTGRES_HOST;
    const db = process.env.POSTGRES_DATABASE || '21clothing';
    return `postgresql://${user}:${pass}@${host}/${db}?sslmode=require`;
  }

  return null;
}

function getNeon(reqOrUrl) {
  const dbUrl = getDbUrl(reqOrUrl);
  if (!dbUrl) return null;

  if (neonClients.has(dbUrl)) {
    return neonClients.get(dbUrl);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const client = neon(dbUrl);
    neonClients.set(dbUrl, client);
    return client;
  } catch (e) {
    console.warn('Failed to initialize @neondatabase/serverless client:', e.message);
    return null;
  }
}

async function initNeonTables(reqOrUrl) {
  const dbUrl = getDbUrl(reqOrUrl);
  if (!dbUrl || tablesInitializedMap.get(dbUrl)) return;

  const sql = getNeon(dbUrl);
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS store_data (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_store_data_key ON store_data(key);
    `;
    tablesInitializedMap.set(dbUrl, true);
  } catch (e) {
    console.error('Error initializing Neon table:', e.message);
  }
}

async function getDatabaseInfo(reqOrUrl) {
  const dbUrl = getDbUrl(reqOrUrl);
  if (!dbUrl) {
    return {
      connected: false,
      type: 'Local JSON Storage',
      name: 'local',
      host: 'localhost',
      mode: 'Local File Mode',
      hasNeonEnv: false
    };
  }

  let dbName = '21clothing';
  let host = 'neon.tech';
  try {
    const parsed = new URL(dbUrl);
    dbName = parsed.pathname.replace(/^\//, '') || '21clothing';
    host = parsed.hostname;
  } catch (e) {}

  let liveConnected = false;
  let connError = null;

  const sql = getNeon(dbUrl);
  if (sql) {
    try {
      await sql`SELECT 1`;
      await initNeonTables(dbUrl);
      liveConnected = true;
    } catch (e) {
      connError = e.message;
    }
  }

  return {
    connected: liveConnected,
    type: 'Neon Serverless Postgres',
    name: dbName,
    host: host,
    mode: liveConnected ? 'Cloud Database (Neon)' : 'Connection Error',
    hasNeonEnv: Boolean(
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.NEON_DATABASE_URL ||
      (process.env.POSTGRES_HOST && process.env.POSTGRES_USER)
    ),
    error: connError
  };
}

async function getStoreData(key, fallback, reqOrUrl) {
  const defaultFallback = fallback !== undefined ? fallback : DEFAULTS[key];
  const sql = getNeon(reqOrUrl);

  if (sql) {
    await initNeonTables(reqOrUrl);
    try {
      const rows = await sql`SELECT data FROM store_data WHERE key = ${key}`;
      if (rows && rows.length > 0) {
        return rows[0].data;
      }

      // If key doesn't exist in Neon, seed default immediately
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(defaultFallback)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO NOTHING;
      `;
      return defaultFallback;
    } catch (e) {
      console.error(`Neon query failed for key ${key}, falling back to disk/defaults:`, e.message);
    }
  }

  // Local filesystem fallback
  const filePath = FILES[key];
  if (filePath && fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return defaultFallback;
    }
  }
  return defaultFallback;
}

async function setStoreData(key, data, reqOrUrl) {
  const sql = getNeon(reqOrUrl);
  if (sql) {
    await initNeonTables(reqOrUrl);
    try {
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(data)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;
    } catch (e) {
      console.error(`Neon save failed for key ${key}:`, e.message);
    }
  }

  // Also sync to disk if filesystem is writable
  const filePath = FILES[key];
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      // Expected on read-only serverless filesystems (e.g. Vercel)
    }
  }
  return data;
}

async function syncAllToNeon(bundle, reqOrUrl) {
  const sql = getNeon(reqOrUrl);
  if (!sql) {
    throw new Error('Neon database connection is not configured or unavailable');
  }

  await initNeonTables(reqOrUrl);

  const syncedKeys = [];
  for (const [key, val] of Object.entries(bundle)) {
    if (val !== undefined) {
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(val)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;
      syncedKeys.push(key);
    }
  }

  return { success: true, count: syncedKeys.length, keys: syncedKeys };
}

async function resetStoreData(reqOrUrl) {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await setStoreData(key, value, reqOrUrl);
  }
  return true;
}

module.exports = {
  getStoreData,
  setStoreData,
  resetStoreData,
  syncAllToNeon,
  getDatabaseInfo,
  initNeonTables,
  getNeon,
  isNeonActive: (reqOrUrl) => Boolean(getDbUrl(reqOrUrl))
};

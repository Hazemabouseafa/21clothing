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

let neonSql = null;
let tablesInitialized = false;

function getDbUrl() {
  return process.env.DATABASE_URL ||
         process.env.POSTGRES_URL ||
         process.env.POSTGRES_PRISMA_URL ||
         process.env.NEON_DATABASE_URL ||
         null;
}

function getNeon() {
  if (neonSql) return neonSql;
  const dbUrl = getDbUrl();
  if (dbUrl) {
    try {
      const { neon } = require('@neondatabase/serverless');
      neonSql = neon(dbUrl);
    } catch (e) {
      console.warn('Failed to load @neondatabase/serverless, falling back to local files:', e.message);
    }
  }
  return neonSql;
}

function getDatabaseInfo() {
  const dbUrl = getDbUrl();
  if (!dbUrl) {
    return {
      connected: false,
      type: 'Local JSON Storage',
      name: 'local',
      host: 'localhost',
      mode: 'Local File Mode'
    };
  }

  let dbName = '21clothing';
  let host = 'neon.tech';
  try {
    const parsed = new URL(dbUrl);
    dbName = parsed.pathname.replace(/^\//, '') || '21clothing';
    host = parsed.hostname;
  } catch (e) {}

  return {
    connected: true,
    type: 'Neon Serverless Postgres',
    name: dbName,
    host: host,
    mode: 'Cloud Database (Neon)'
  };
}

async function initNeonTables() {
  if (tablesInitialized) return;
  const sql = getNeon();
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
    tablesInitialized = true;
  } catch (e) {
    console.error('Error initializing Neon table:', e);
  }
}

async function getStoreData(key, fallback) {
  const defaultFallback = fallback !== undefined ? fallback : DEFAULTS[key];
  const sql = getNeon();

  if (sql) {
    await initNeonTables();
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
      console.error(`Neon query failed for key ${key}, falling back to disk/defaults:`, e);
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

async function setStoreData(key, data) {
  const sql = getNeon();
  if (sql) {
    await initNeonTables();
    try {
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(data)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;
    } catch (e) {
      console.error(`Neon save failed for key ${key}:`, e);
    }
  }

  // Also sync to disk if filesystem is writable
  const filePath = FILES[key];
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }
  return data;
}

async function resetStoreData() {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await setStoreData(key, value);
  }
  return true;
}

module.exports = {
  getStoreData,
  setStoreData,
  resetStoreData,
  getDatabaseInfo,
  initNeonTables,
  isNeonActive: () => Boolean(getDbUrl())
};

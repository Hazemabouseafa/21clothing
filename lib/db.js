const fs = require('fs');
const path = require('path');

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
  content: path.join(DATA_DIR, 'content.json')
};

let neonSql = null;
let tablesInitialized = false;

function getNeon() {
  if (neonSql) return neonSql;
  const dbUrl = process.env.DATABASE_URL;
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
    tablesInitialized = true;
  } catch (e) {
    console.error('Error initializing Neon table:', e);
  }
}

async function getStoreData(key, fallback) {
  const sql = getNeon();
  if (sql) {
    await initNeonTables();
    try {
      const rows = await sql`SELECT data FROM store_data WHERE key = ${key}`;
      if (rows && rows.length > 0) {
        return rows[0].data;
      }
      // If empty in Neon, seed default
      await sql`
        INSERT INTO store_data (key, data)
        VALUES (${key}, ${JSON.stringify(fallback)})
        ON CONFLICT (key) DO NOTHING;
      `;
      return fallback;
    } catch (e) {
      console.error(`Neon query failed for key ${key}, falling back to disk:`, e);
    }
  }

  // Local fallback
  const filePath = FILES[key];
  if (filePath && fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
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

  // Also save to disk if available
  const filePath = FILES[key];
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }
  return data;
}

module.exports = {
  getStoreData,
  setStoreData,
  isNeonActive: () => Boolean(process.env.DATABASE_URL)
};

const fs = require('fs');
const path = require('path');
const os = require('os');
const { DEFAULTS } = require('./defaults');

// Load .env in local/VPS environments if present
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

const IS_VERCEL = Boolean(process.env.VERCEL);
// Default to 'local' on VPS / Coolify / Docker / Localhost; 'auto' on Vercel so live Vercel site stays intact
const DB_MODE = (process.env.DB_MODE || (IS_VERCEL ? 'auto' : 'local')).toLowerCase();

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');

const SEED_DIR = path.join(__dirname, '..', 'seed_data');
const TMP_DATA_DIR = path.join(os.tmpdir(), 'twentyone_store_data');

for (const dir of [DATA_DIR, TMP_DATA_DIR]) {
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
  }
}

const KEY_FILENAMES = {
  products: 'products.json',
  orders: 'orders.json',
  promos: 'promos.json',
  shipping: 'shipping.json',
  settings: 'settings.json',
  content: 'content.json',
  sizeGuides: 'size-guides.json'
};

const FILES = {};
const SEED_FILES = {};
const TMP_FILES = {};

for (const [key, filename] of Object.entries(KEY_FILENAMES)) {
  FILES[key] = path.join(DATA_DIR, filename);
  SEED_FILES[key] = path.join(SEED_DIR, filename);
  TMP_FILES[key] = path.join(TMP_DATA_DIR, filename);
}

const SQLITE_PATH = path.join(DATA_DIR, '21clothing.sqlite');

const memoryStore = new Map();
const neonClients = new Map();
const tablesInitializedMap = new Map();

let sqliteDb = null;
let sqliteInitAttempted = false;
let localSeedCompleted = false;

function readJsonSafe(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return undefined;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw || !raw.trim()) return undefined;
    return JSON.parse(raw);
  } catch (e) {
    return undefined;
  }
}

function writeJsonAtomic(filePath, data) {
  if (!filePath) return false;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const isCompact = filePath.endsWith('products.json') || filePath.endsWith('orders.json');
    const serialized = isCompact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
    const tmpFile = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, serialized, 'utf8');
    fs.renameSync(tmpFile, filePath);
    return true;
  } catch (e) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
      return true;
    } catch (_) {
      return false;
    }
  }
}

function getInitialSeedForKey(key) {
  // 1. Existing file in DATA_DIR
  const fromData = readJsonSafe(FILES[key]);
  if (fromData !== undefined) return fromData;

  // 2. Preserved production backup in SEED_DIR (crucial when Coolify mounts a fresh empty volume on /app/data)
  const fromSeed = readJsonSafe(SEED_FILES[key]);
  if (fromSeed !== undefined) return fromSeed;

  // 3. Built-in code defaults
  return DEFAULTS[key];
}

function getSqlite() {
  if (IS_VERCEL && DB_MODE !== 'local') return null;
  if (sqliteDb) return sqliteDb;
  if (sqliteInitAttempted) return null;

  sqliteInitAttempted = true;
  try {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(SQLITE_PATH);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS store_data (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    sqliteDb = db;
    ensureLocalDbSeeded();
    return sqliteDb;
  } catch (e) {
    console.warn('[LocalDB] node:sqlite unavailable, using atomic JSON persistence in', DATA_DIR, '-', e.message);
    ensureLocalJsonSeeded();
    return null;
  }
}

function ensureLocalJsonSeeded() {
  if (localSeedCompleted) return;
  localSeedCompleted = true;
  for (const key of Object.keys(KEY_FILENAMES)) {
    if (!fs.existsSync(FILES[key])) {
      const seedVal = getInitialSeedForKey(key);
      if (seedVal !== undefined) {
        writeJsonAtomic(FILES[key], seedVal);
        memoryStore.set(key, seedVal);
      }
    }
  }
}

function ensureLocalDbSeeded() {
  if (localSeedCompleted || !sqliteDb) return;
  localSeedCompleted = true;

  try {
    const selectStmt = sqliteDb.prepare('SELECT data FROM store_data WHERE key = ?');
    const insertStmt = sqliteDb.prepare(`
      INSERT INTO store_data (key, data, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO NOTHING
    `);

    for (const key of Object.keys(KEY_FILENAMES)) {
      const existing = selectStmt.get(key);
      if (!existing) {
        const seedVal = getInitialSeedForKey(key);
        if (seedVal !== undefined) {
          insertStmt.run(key, JSON.stringify(seedVal));
          if (!fs.existsSync(FILES[key])) {
            writeJsonAtomic(FILES[key], seedVal);
          }
          memoryStore.set(key, seedVal);
        }
      } else {
        // Also ensure JSON mirror exists in DATA_DIR
        if (!fs.existsSync(FILES[key])) {
          try {
            writeJsonAtomic(FILES[key], JSON.parse(existing.data));
          } catch (_) {}
        }
      }
    }
  } catch (e) {
    console.error('[LocalDB] Error seeding SQLite database:', e.message);
  }
}

function isLocalModeForced() {
  return DB_MODE === 'local' || DB_MODE === 'sqlite' || DB_MODE === 'file';
}

function getDbUrl(reqOrUrl) {
  // In local VPS/Coolify mode, never use external cloud DB unless explicitly switched out of local mode
  if (isLocalModeForced()) return null;

  if (typeof reqOrUrl === 'string' && reqOrUrl.trim()) {
    return reqOrUrl.trim();
  }
  if (reqOrUrl && reqOrUrl.headers) {
    const headerUrl = reqOrUrl.headers['x-database-url'] || reqOrUrl.headers['x-db-url'];
    if (headerUrl && typeof headerUrl === 'string' && headerUrl.trim()) {
      return headerUrl.trim();
    }
  }

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
    if (url.includes('neon.tech') && !url.includes('sslmode=')) {
      url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    return url;
  }

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

  // Local VPS / Coolify Database Mode
  if (!dbUrl) {
    const sqlite = getSqlite();
    const hasWritableDisk = !IS_VERCEL;
    return {
      connected: hasWritableDisk,
      isLocalDb: true,
      engine: sqlite ? 'sqlite' : 'json-fs',
      type: sqlite ? 'Local SQLite Database (VPS)' : 'Local Persistent JSON DB',
      name: sqlite ? '21clothing.sqlite' : path.basename(DATA_DIR),
      host: os.hostname() || 'localhost',
      dataDir: DATA_DIR,
      mode: sqlite ? 'Local SQLite + JSON Backup (Coolify/VPS)' : 'Local File Database',
      hasNeonEnv: false,
      error: null
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
    isLocalDb: false,
    engine: 'neon-postgres',
    type: 'Neon Serverless Postgres',
    name: dbName,
    host: host,
    mode: liveConnected ? 'Cloud Database (Neon)' : 'Connection Error',
    hasNeonEnv: true,
    error: connError
  };
}

async function getStoreData(key, fallback, reqOrUrl) {
  const defaultFallback = fallback !== undefined ? fallback : getInitialSeedForKey(key);
  const sql = getNeon(reqOrUrl);

  // 1. Cloud Neon Postgres (active on Vercel when DB_MODE !== 'local')
  if (sql) {
    await initNeonTables(reqOrUrl);
    try {
      const rows = await sql`SELECT data FROM store_data WHERE key = ${key}`;
      if (rows && rows.length > 0) {
        memoryStore.set(key, rows[0].data);
        return rows[0].data;
      }

      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(defaultFallback)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO NOTHING;
      `;
      memoryStore.set(key, defaultFallback);
      return defaultFallback;
    } catch (e) {
      console.error(`Neon query failed for key ${key}, falling back to local DB:`, e.message);
    }
  }

  // 2. Local SQLite Database (primary engine on Coolify VPS & local server)
  const sqlite = getSqlite();
  if (sqlite) {
    try {
      const row = sqlite.prepare('SELECT data FROM store_data WHERE key = ?').get(key);
      if (row && row.data !== undefined) {
        const parsed = JSON.parse(row.data);
        memoryStore.set(key, parsed);
        return parsed;
      }
      if (defaultFallback !== undefined) {
        sqlite.prepare(`
          INSERT INTO store_data (key, data, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT(key) DO NOTHING
        `).run(key, JSON.stringify(defaultFallback));
        memoryStore.set(key, defaultFallback);
        return defaultFallback;
      }
    } catch (e) {
      console.error(`[LocalDB] SQLite read failed for ${key}:`, e.message);
    }
  }

  // 3. Persistent DATA_DIR JSON file
  const diskVal = readJsonSafe(FILES[key]);
  if (diskVal !== undefined) {
    memoryStore.set(key, diskVal);
    return diskVal;
  }

  // 4. In-memory cache
  if (memoryStore.has(key)) {
    return memoryStore.get(key);
  }

  // 5. Writable temp directory cache
  const tmpVal = readJsonSafe(TMP_FILES[key]);
  if (tmpVal !== undefined) {
    memoryStore.set(key, tmpVal);
    return tmpVal;
  }

  // 6. Seed directory fallback
  const seedVal = readJsonSafe(SEED_FILES[key]);
  if (seedVal !== undefined) {
    memoryStore.set(key, seedVal);
    return seedVal;
  }

  return defaultFallback;
}

async function setStoreData(key, data, reqOrUrl) {
  memoryStore.set(key, data);

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

  // Persist to Local SQLite DB (when running on VPS / Coolify / Local)
  const sqlite = getSqlite();
  if (sqlite) {
    try {
      sqlite.prepare(`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE
        SET data = excluded.data, updated_at = datetime('now')
      `).run(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[LocalDB] SQLite write failed for ${key}:`, e.message);
    }
  }

  // Persist atomic JSON mirror to DATA_DIR (if writable, e.g. Coolify volume)
  if (FILES[key]) {
    writeJsonAtomic(FILES[key], data);
  }

  // Also write to /tmp if on serverless
  if (IS_VERCEL && TMP_FILES[key]) {
    writeJsonAtomic(TMP_FILES[key], data);
  }

  return data;
}

async function syncAllToNeon(bundle, reqOrUrl) {
  const sql = getNeon(reqOrUrl);
  const sqlite = getSqlite();
  const syncedKeys = [];
  for (const [key, val] of Object.entries(bundle)) {
    if (val !== undefined && KEY_FILENAMES[key]) {
      await setStoreData(key, val, reqOrUrl);
      syncedKeys.push(key);
    }
  }
  return {
    success: true,
    count: syncedKeys.length,
    keys: syncedKeys,
    cloud: Boolean(sql),
    localDb: Boolean(sqlite || !IS_VERCEL)
  };
}

async function exportAllStoreData(reqOrUrl) {
  const result = {
    version: '22.0',
    exportedAt: new Date().toISOString(),
    products: await getStoreData('products', undefined, reqOrUrl),
    orders: await getStoreData('orders', undefined, reqOrUrl),
    promos: await getStoreData('promos', undefined, reqOrUrl),
    shipping: await getStoreData('shipping', undefined, reqOrUrl),
    settings: await getStoreData('settings', undefined, reqOrUrl),
    content: await getStoreData('content', undefined, reqOrUrl),
    sizeGuides: await getStoreData('sizeGuides', undefined, reqOrUrl)
  };
  return result;
}

async function migrateFromRemoteUrl(remoteBaseUrl, reqOrUrl) {
  const cleanBase = String(remoteBaseUrl || 'https://21clothingwear.com').trim().replace(/\/+$/, '');
  const endpoints = {
    products: '/api/products',
    orders: '/api/orders',
    promos: '/api/promos',
    shipping: '/api/shipping',
    settings: '/api/settings',
    content: '/api/content',
    sizeGuides: '/api/size-guides'
  };

  const imported = {};
  for (const [key, ep] of Object.entries(endpoints)) {
    const res = await fetch(`${cleanBase}${ep}?_t=${Date.now()}`, {
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${ep} from ${cleanBase} (HTTP ${res.status})`);
    }
    const json = await res.json();
    imported[key] = json;
  }

  for (const [key, val] of Object.entries(imported)) {
    await setStoreData(key, val, reqOrUrl);
  }

  return {
    success: true,
    source: cleanBase,
    productsCount: Array.isArray(imported.products) ? imported.products.length : 0,
    ordersCount: Array.isArray(imported.orders) ? imported.orders.length : 0
  };
}

async function resetStoreData(reqOrUrl) {
  for (const key of Object.keys(KEY_FILENAMES)) {
    const seedVal = readJsonSafe(SEED_FILES[key]) ?? DEFAULTS[key];
    await setStoreData(key, seedVal, reqOrUrl);
  }
  return true;
}

function closeLocalDb() {
  if (sqliteDb) {
    try {
      sqliteDb.exec('PRAGMA wal_checkpoint(TRUNCATE);');
      sqliteDb.close();
    } catch (e) {}
    sqliteDb = null;
  }
}

module.exports = {
  getStoreData,
  setStoreData,
  resetStoreData,
  syncAllToNeon,
  exportAllStoreData,
  migrateFromRemoteUrl,
  getDatabaseInfo,
  initNeonTables,
  getNeon,
  closeLocalDb,
  DATA_DIR,
  SQLITE_PATH,
  isNeonActive: (reqOrUrl) => Boolean(getDbUrl(reqOrUrl) || !IS_VERCEL)
};

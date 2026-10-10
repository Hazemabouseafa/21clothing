/**
 * Neon Postgres Connection Diagnostic Tool for 21 Clothing
 * Run with: npm run db:test
 */

const path = require('path');
const fs = require('fs');

// Load .env
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
} catch (e) {}

const dbUrl = process.env.DATABASE_URL ||
              process.env.POSTGRES_URL ||
              process.env.POSTGRES_PRISMA_URL ||
              process.env.NEON_DATABASE_URL;

console.log('====================================================');
console.log('⚡ 21 CLOTHING — NEON POSTGRES CONNECTION TEST');
console.log('====================================================');

if (!dbUrl) {
  console.log('\n❌ No DATABASE_URL found in process.env or .env file.');
  console.log('\n📌 How to connect your Neon database (21clothing):');
  console.log('1. Go to your Neon Console: https://console.neon.tech');
  console.log('2. Under your Project, create/select the database named: 21clothing');
  console.log('3. Copy the Connection String (URI with sslmode=require).');
  console.log('4. Create a .env file in the root directory:');
  console.log('   DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/21clothing?sslmode=require"');
  console.log('5. On Vercel: Add DATABASE_URL to your Project Settings > Environment Variables.\n');
  process.exit(1);
}

// Mask password for safe display
let maskedUrl = dbUrl;
try {
  const parsed = new URL(dbUrl);
  if (parsed.password) {
    parsed.password = '••••••••';
    maskedUrl = parsed.toString();
  }
} catch (e) {}

console.log(`Connecting to: ${maskedUrl} ...\n`);

async function testConnection() {
  try {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(dbUrl);

    const [diag] = await sql`SELECT current_database() as db_name, version() as ver, NOW() as current_time;`;
    console.log('✅ SUCCESS: Connected to Neon Serverless Postgres!');
    console.log(`   Database Name:    ${diag.db_name}`);
    console.log(`   Postgres Version: ${diag.ver.split(' ')[0]} ${diag.ver.split(' ')[1]}`);
    console.log(`   Server Timestamp: ${diag.current_time}`);

    // Check table
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

    const rows = await sql`SELECT key, updated_at FROM store_data ORDER BY key ASC;`;
    console.log(`\n📦 Table 'store_data' status:`);
    if (rows.length === 0) {
      console.log('   Table is currently empty. It will auto-seed with official 21 catalog on first request!');
    } else {
      console.log(`   Found ${rows.length} store data categories:`);
      rows.forEach(r => console.log(`   - ${r.key.padEnd(12)} (last updated: ${r.updated_at})`));
    }

    console.log('\n🚀 Ready for Vercel deployment with Neon Postgres!\n');
  } catch (err) {
    console.error('\n❌ Connection Error:', err.message);
    console.error('Please verify your connection string and ensure sslmode=require is included.\n');
    process.exit(1);
  }
}

testConnection();

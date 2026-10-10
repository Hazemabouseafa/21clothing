-- ================================================================
-- 21 (TWENTY ONE CLOTHING) — NEON POSTGRES SCHEMA
-- Database Name: 21clothing
-- ================================================================
-- This table is created automatically by the app on first run,
-- but you can also execute it directly in your Neon SQL Editor
-- at https://console.neon.tech.

CREATE TABLE IF NOT EXISTS store_data (
  key VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for ultra-fast JSON lookups
CREATE INDEX IF NOT EXISTS idx_store_data_key ON store_data(key);

-- ================================================================
-- HELPFUL VERIFICATION QUERIES (RUN IN NEON SQL EDITOR)
-- ================================================================

-- 1. View all stored data categories and timestamps
-- SELECT key, updated_at FROM store_data ORDER BY key ASC;

-- 2. View all 21 Hoodies (Formatted JSON)
-- SELECT jsonb_pretty(data) FROM store_data WHERE key = 'products';

-- 3. View customer orders
-- SELECT jsonb_pretty(data) FROM store_data WHERE key = 'orders';

-- 4. View promo codes
-- SELECT jsonb_pretty(data) FROM store_data WHERE key = 'promos';

-- 5. View store content and brand settings
-- SELECT jsonb_pretty(data) FROM store_data WHERE key IN ('content', 'settings', 'shipping');

-- Neon Postgres Schema for 21 Clothing
-- This table is created automatically by the app on first run,
-- but you can also execute it directly in your Neon SQL Editor.

CREATE TABLE IF NOT EXISTS store_data (
  key VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for ultra-fast JSON lookups
CREATE INDEX IF NOT EXISTS idx_store_data_key ON store_data(key);

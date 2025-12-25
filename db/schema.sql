-- Shared Dashboards Table for GenUI
-- Run this in your Vercel Postgres dashboard or via SQL client

CREATE TABLE IF NOT EXISTS shared_dashboards (
    id SERIAL PRIMARY KEY,
    share_id VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    schema JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0
);

-- Index for fast lookups by share_id
CREATE INDEX IF NOT EXISTS idx_shared_dashboards_share_id ON shared_dashboards(share_id);

-- Create rate_limits table for GDPR-compliant rate limiting
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  hashed_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_hashed_ip_created_at 
ON rate_limits (hashed_ip, created_at DESC);

-- Create index for cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at 
ON rate_limits (created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert (for API route)
CREATE POLICY "Allow service role insert" ON rate_limits
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only service role can select (for API route)
CREATE POLICY "Allow service role select" ON rate_limits
  FOR SELECT
  USING (true);

-- Policy: Only service role can delete (for cleanup)
CREATE POLICY "Allow service role delete" ON rate_limits
  FOR DELETE
  USING (true);

-- Comment
COMMENT ON TABLE rate_limits IS 'GDPR-compliant rate limiting: stores hashed IP addresses and timestamps';


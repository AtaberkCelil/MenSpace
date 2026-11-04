CREATE TABLE IF NOT EXISTS official_rate_limit (
  ip_hash TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(ip_hash, bucket)
);

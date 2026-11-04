CREATE TABLE IF NOT EXISTS official_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL CHECK(length(alias) BETWEEN 1 AND 24),
  score INTEGER NOT NULL CHECK(score >= 0 AND score <= 400),
  duration_ms INTEGER NOT NULL CHECK(duration_ms >= 0),
  created_at INTEGER NOT NULL,
  seed INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_official_top ON official_scores(score DESC, created_at ASC);
CREATE TABLE IF NOT EXISTS official_rate_limit (
  ip_hash TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(ip_hash, bucket)
);

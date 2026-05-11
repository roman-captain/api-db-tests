CREATE TABLE IF NOT EXISTS pets (
  id         BIGINT PRIMARY KEY,
  name       TEXT NOT NULL,
  status     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

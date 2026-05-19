-- Migration: Add walk-in support
-- Adds DNI column to users and creates walk_in_guests table

ALTER TABLE users ADD COLUMN IF NOT EXISTS dni VARCHAR(20) UNIQUE;

CREATE TABLE IF NOT EXISTS walk_in_guests (
  id_walk_in_guest SERIAL PRIMARY KEY,
  id_occupancy INTEGER NOT NULL REFERENCES occupancies(id_occupancy) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_walk_in_guests_occupancy ON walk_in_guests(id_occupancy);
CREATE INDEX IF NOT EXISTS idx_users_dni ON users(dni);

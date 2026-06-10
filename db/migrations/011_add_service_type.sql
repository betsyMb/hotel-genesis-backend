-- Add service_type column to reservations and occupancies tables
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS service_type VARCHAR(10) NOT NULL DEFAULT 'nightly';
ALTER TABLE occupancies ADD COLUMN IF NOT EXISTS service_type VARCHAR(10) NOT NULL DEFAULT 'nightly';

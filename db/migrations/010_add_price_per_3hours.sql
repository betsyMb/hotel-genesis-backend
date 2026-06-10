-- Add price_per_3hours column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS price_per_3hours DECIMAL(10,2) NOT NULL DEFAULT 0;

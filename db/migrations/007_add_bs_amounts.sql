-- Migration: Add Bs amount fields for historical exchange rate tracking
-- Adds total_amount_bs to reservations and total_amount/total_amount_bs to occupancies

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS total_amount_bs DECIMAL(12,2) DEFAULT NULL;

ALTER TABLE occupancies ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT NULL CHECK (total_amount >= 0);
ALTER TABLE occupancies ADD COLUMN IF NOT EXISTS total_amount_bs DECIMAL(12,2) DEFAULT NULL;

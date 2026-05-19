-- Migration: Make id_reservation nullable in occupancies for walk-in support
ALTER TABLE occupancies ALTER COLUMN id_reservation DROP NOT NULL;

-- 004_add_maintenance_notes_to_rooms.sql
-- Adds a maintenance_notes column to the rooms table

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS maintenance_notes TEXT NULL;

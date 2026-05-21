-- 005_add_maintenance_tasks_to_rooms.sql
-- Adds a maintenance_tasks JSONB column to the rooms table

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS maintenance_tasks JSONB NULL;

-- Migration: Allow same-day reservations (check_out_date >= check_in_date)
-- Changes the check constraint from strict > to >=

ALTER TABLE reservations DROP CONSTRAINT IF EXISTS check_dates;
ALTER TABLE reservations ADD CONSTRAINT check_dates CHECK (check_out_date >= check_in_date);

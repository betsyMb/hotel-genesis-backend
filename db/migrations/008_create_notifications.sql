-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id_notification SERIAL PRIMARY KEY,
  id_user INTEGER NOT NULL REFERENCES users(id_user),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  id_reservation INTEGER REFERENCES reservations(id_reservation),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(id_user);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(id_user, is_read);

-- Insert admin user (password: admin123)
INSERT INTO users (email, name, password, role) 
VALUES ('admin@example.com', 'Admin User', '$2a$10$rOzJqQZQQQQQQQQQQQQQQOeKqQZQQQQQQQQQQQQQQQQQQQQQQQQQQQ', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample user (password: user123)
INSERT INTO users (email, name, password, role) 
VALUES ('user@example.com', 'John Doe', '$2a$10$rOzJqQZQQQQQQQQQQQQQQOeKqQZQQQQQQQQQQQQQQQQQQQQQQQQQQ', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (first_name, last_name, email, title, description, appointment_date, appointment_time)
VALUES 
  ('John', 'Doe', 'john.doe@example.com', 'Consultation Meeting', 'Initial consultation', CURRENT_DATE + INTERVAL '2 days', '10:00:00'),
  ('Jane', 'Smith', 'jane.smith@example.com', 'Follow-up Meeting', 'Follow-up discussion', CURRENT_DATE + INTERVAL '3 days', '14:30:00')
ON CONFLICT (appointment_date, appointment_time) DO NOTHING;

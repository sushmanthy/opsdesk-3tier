CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  assignee VARCHAR(100) NOT NULL DEFAULT 'Unassigned',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tickets (title, description, priority, status, assignee)
SELECT 'Production API latency', 'Investigate elevated response time on the orders API.', 'High', 'In Progress', 'Arun'
WHERE NOT EXISTS (SELECT 1 FROM tickets);

INSERT INTO tickets (title, description, priority, status, assignee)
SELECT 'Renew TLS certificate', 'Track certificate renewal before the production deadline.', 'Critical', 'Open', 'Meena'
WHERE (SELECT COUNT(*) FROM tickets) < 2;

INSERT INTO tickets (title, description, priority, status, assignee)
SELECT 'Dashboard UI polish', 'Improve spacing and empty-state experience.', 'Low', 'Resolved', 'Vikram'
WHERE (SELECT COUNT(*) FROM tickets) < 3;

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "opsdesk",
  user: process.env.DB_USER || "opsdesk",
  password: process.env.DB_PASSWORD || "opsdeskpass"
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", service: "opsdesk-api", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", error: err.message });
  }
});

app.get("/api/tickets", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tickets ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/tickets/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tickets WHERE id=$1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Ticket not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  const { title, description = "", priority = "Medium", status = "Open", assignee = "Unassigned" } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
  try {
    const { rows } = await pool.query(
      "INSERT INTO tickets(title,description,priority,status,assignee) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [title.trim(), description, priority, status, assignee]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tickets/:id", async (req, res) => {
  const { title, description = "", priority = "Medium", status = "Open", assignee = "Unassigned" } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
  try {
    const { rows } = await pool.query(
      "UPDATE tickets SET title=$1,description=$2,priority=$3,status=$4,assignee=$5 WHERE id=$6 RETURNING *",
      [title.trim(), description, priority, status, assignee, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Ticket not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tickets/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM tickets WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`OpsDesk API listening on ${process.env.PORT || 5000}`);
});

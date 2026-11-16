
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");

    res.json({
      status: "MySQL connection successful!",
      databaseTime: rows[0].time,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({
      error: "Could not connect to the database",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

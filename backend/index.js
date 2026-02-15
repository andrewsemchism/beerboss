const express = require("express");
const http = require("http");
const cors = require("cors");
const Database = require("better-sqlite3");

// Open SQLite DB file (mounted into container)
const db = new Database("beer_data.sqlite");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.get("/allbeer", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM beer_data").all();
    res.json(rows);
  } catch (err) {
    console.error("Error executing SQLite query:", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

// Always use plain HTTP — Nginx handles HTTPS outside the container
const server = http.createServer(app);

server.listen(3001, () => {
  console.log("Backend server is running with SQLite on port 3001 (HTTP)!");
});

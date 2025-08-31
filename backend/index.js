const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
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

let server;

if (process.env.NODE_ENV === "production") {
  // Production: HTTPS
  const privateKey = fs.readFileSync("server.key", "utf8");
  const certificate = fs.readFileSync("beerboss_ca_chain.crt", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
} else {
  // Development: HTTP
  server = http.createServer(app);
}

server.listen(3001, () => {
  console.log("Backend server is running with SQLite!");
});

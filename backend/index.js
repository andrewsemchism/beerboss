const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/allbeer", (req, res) => {
  const SelectQuery = "SELECT * FROM beer_data";
  db.query(SelectQuery, (err, result) => {
    if (err) {
      console.error("Error executing database query:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }
    res.json(result);
  });
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
  console.log("Backend server is running!");
});

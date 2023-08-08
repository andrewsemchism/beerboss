const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const data = [
    { name: 'Item 1' },
    { name: 'Item 2' },
  ];

  res.json(data);
});

app.get('/get', (req, res) => {
  
  const SelectQuery = "SELECT * FROM beer_data";
  db.query(SelectQuery, (err, result) => {
    if (err) {
      console.error('Error executing database query:', err);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    res.json(result)
  })
  
})

app.listen('3001', () => { })
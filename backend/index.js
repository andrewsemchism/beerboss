const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const db = mysql.createPool({
  host: 'mysql_db', // the host name MYSQL_DATABASE: node_mysql
  user: 'MYSQL_USER', // database user MYSQL_USER: MYSQL_USER
  password: 'MYSQL_PASSWORD', // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
  database: 'beers' // database name MYSQL_HOST_IP: mysql_db
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
  /*
  const SelectQuery = " SELECT * FROM beers";
  db.query(SelectQuery, (err, result) => {
    res.send(result)
  })
  */
})

app.listen('3001', () => { })
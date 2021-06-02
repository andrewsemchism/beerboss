var express = require('express');
var mysql = require('mysql');
var router = express.Router();
require('dotenv').config()

/* GET home page. */
router.get('/', function (req, res, next) {

  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  })

  connection.query('SELECT * FROM beer', (err, rows, fields) => {
    if (err) {
      console.log("Error fetching data");
      res.sendStatus(500)
      return
    }
    data = {
      print: rows,
      page_name: 'index'
    }
    res.render('index', data);
  })

  connection.end()

});

/* GET about page. */
router.get('/about', function (req, res, next) {
  data = {
    page_name: 'about'
  }
  res.render('about', data);
});

module.exports = router;

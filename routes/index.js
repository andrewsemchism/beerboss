var express = require('express');
var mysql = require('mysql');
var router = express.Router();
require('dotenv').config()

/* GET home page. */
router.get('/', function (req, res, next) {
    data = {
      page_name: 'index'
    }
    res.render('index', data);
});

/* GET All Beer Prices page. */
router.get('/all', function (req, res, next) {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  })
  connection.query('SELECT * FROM beer_data', (err, rows, fields) => {
    if (err) {
      console.log("Error fetching data");
      res.sendStatus(500)
      return
    }
    data = {
      print: rows,
      page_name: 'all'
    }
    res.render('all', data);
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

/* GET best value analyzer page. */
router.get('/value', function (req, res, next) {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  })
  connection.query('SELECT * FROM beer_data', (err, rows, fields) => {
    if (err) {
      console.log("Error fetching data");
      res.sendStatus(500)
      return
    }
    let beerNames = rows.map(beer => beer.beer_name_formatted);
    let beerNamesUnique = [...new Set(beerNames)];
    beerNamesUnique.sort();
    data = {
      print: rows,
      page_name: 'value-analyzer',
      beers: beerNamesUnique
    }
    res.render('value', data);
  })
  connection.end();
});

module.exports = router;

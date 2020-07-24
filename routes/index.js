var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "andrew123",
    database : "mydatabase"
  })

  connection.query('SELECT * FROM beer', (err, rows, fields) => {
    if (err){
        console.log("Error fetching data");
        res.sendStatus(500)
        return
    }
    data = {print : rows}
    res.render('index', data)
  })

});

module.exports = router;

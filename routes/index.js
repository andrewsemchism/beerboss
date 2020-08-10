var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const connection = mysql.createConnection({
    host : "us-cdbr-east-02.cleardb.com",
    user : "b295efe6037c4c",
    password : "8b12d852",
    database : "heroku_85f2e11d0809ba2"
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

  connection.end()

});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about')
});

module.exports = router;

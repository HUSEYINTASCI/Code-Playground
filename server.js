var express = require('express'), bodyParser = require('body-parser'), form = require('express-form'), field = form.field;

// env variable to help determine what environment we are in
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var ejs = require('ejs')
const mysql = require("mysql");

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('server/views'));
app.use(bodyParser());


//Mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "345876",
    database: "cplayground_db"
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
  });


app.get('/', function(req, res) {
    res.render(__dirname + '/view/views/test_run.ejs');
  });
  
   
  app.get('/html', function(req, res) {
    res.render(__dirname + '/view/views/html/html.ejs');
  });
  
 
  app.get('/css', function(req, res) {
    res.render(__dirname + '/view/views/css/css.ejs');
  });
  
 
  app.get('/js', function(req, res) {
    res.render(__dirname + '/view/views/js/js.ejs');
  });
  
   
  app.get('/template', function(req, res) {
    res.render(__dirname + '/view/views/template.ejs');
  });
  
  var port = 5000;
      app.listen(port);
  console.log('Listening on port ' + port + '...');
var express = require('express'), bodyParser = require('body-parser'), form = require('express-form'), field = form.field;
var app = express();
var ejs = require('ejs')
const mysql = require("mysql");
var bcrypt = require('bcryptjs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 1 * 1000 * 60 * 60 * 24 * 365 } }));

app.use(cookieParser());
 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('public/home'));
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

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
});
// -------------------------------------------------------------------------------------------------

// Signin

app.post("/signin", function (req, res) {

  var userEmail = req.body.email;
  var password = req.body.psw;
   
  connection.query('SELECT * FROM users WHERE u_email = ?', [userEmail], function (error, results, fields) {
    if (error) throw error;
    if (results == 0) {
        
       res.send(" Email or password not correct!. Please  <a style="+"color:"+"red"+"; href="+"signin.html"+"> Try again</a> ");

    } else {
      bcrypt.compare(password, results[0].u_password, function (err, result) {


        if (result == true) {

          req.session.id = results[0].u_id;
          req.session.email = results[0].u_email;
      

          res.redirect('http://localhost:5000/playground');
        
        } else {

          res.send('Connection Error!');
        }
      });
    }
  });
});


//--------------------------------------------------------------------------------------------------
// Signup
app.post('/signup', function (req, res) {
  var userEmail = req.body.email;
  var userName = req.body.username;
  var password = req.body.psw;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, p_hash) {

      connection.query("INSERT INTO users(u_email, u_name, u_password) VALUES (?, ?, ?)", [userEmail, userName, p_hash], function (error, results, fields) {

        var what_user_sees = "";
        if (error) {
          what_user_sees = 'Please use a unique Email';
          
        } else {
 
          what_user_sees = 'You have signed up - Please go Signin at the Signin page. <a style=color:red; href=signin.html> Go Signin Page</a> ';
        }

        res.send(what_user_sees);

      });
    });
  });
});


//--------------------------------------------------------------------------------------------------
app.get('/', function (req, res) {
  res.render(__dirname + 'public/home/index.html');
});

app.get('/signin', function (req, res) {
  res.render(__dirname + 'public/home/signin.html');
});

app.get('/signup', function (req, res) {
  res.render(__dirname + 'public/home/signup.html');
});

app.get('/playground', function (req, res) {
  res.render(__dirname + '/view/views/playground.ejs');
});

app.get('/html', function (req, res) {
  res.render(__dirname + '/view/views/html/html.ejs');
});


app.get('/css', function (req, res) {
  res.render(__dirname + '/view/views/css/css.ejs');
});


app.get('/js', function (req, res) {
  res.render(__dirname + '/view/views/js/js.ejs');
});


app.get('/template', function (req, res) {
  res.render(__dirname + '/view/views/template.ejs');
});

var port =process.env.PORT|| 5000;
app.listen(port);
console.log('Listening on port ' + port + '...');
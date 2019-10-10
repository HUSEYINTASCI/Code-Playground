var mysql = require("mysql");
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

//session stuff
	var cookieParser = require('cookie-parser');

	var session = require('express-session');

	//allow sessions
	app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

	app.use(cookieParser());

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your u_password
  u_password: "ucbsf2019",
  database: "cplayground_db"
});

app.get('/', function(req, res){
	res.send('hi');
});

// http://localhost:3000/user /1
app.get('/user /:id', function(req, res){
	connection.query('SELECT * FROM user WHERE u_id = ?', [req.params.id],function (error, results, fields) {
	  if (error) throw error;
	  
	  res.json(results[0]);
	});
});






app.get('/signup/:u_email/:u_password', function(req, res){
	// http://localhost:3000/signup/haven@yahoo.com/goldenwarriors24
		//salt that is made:
			//$2a$10$niLU8tJeqy5Ed7VVlKCfJe

	bcrypt.genSalt(10, function(err, salt) {
	    // res.send(salt);
	    bcrypt.hash(req.params.u_password, salt, function(err, p_hash) { 

	    	// res.send(p_hash);

	    	connection.query('INSERT INTO user (u_u_email, u_password_hash) VALUES (?, ?)', [req.params.u_email, p_hash],function (error, results, fields) {
	    	  
	    	  var what_user_sees = "";
	    	  if (error){
	    	  	what_user_sees = 'you need to use a unique u_email';
	    	  	// res.send(error)
	    	  }else{
	    	  	what_user_sees = 'you have signed up - please go login at the login route';
	    	  }

	    	  res.send(what_user_sees);
	    	  
	    	});
	    });
	});
});


// localhost:3000/login/haven@yahoo.com/goldenwarriors24
app.get('/login/:u_email/:u_password', function(req, res){

	connection.query('SELECT * FROM user  WHERE u_email = ?', [req.params.u_email],function (error, results, fields) {

	  if (error) throw error;

	  // res.json(results);
	  
	  if (results.length == 0){
	  	res.send('try again');
	  }else {
	  	bcrypt.compare(req.params.u_password, results[0].u_password_hash, function(err, result) {
	  	    
	  	    if (result == true){

	  	      req.session.user_id = results[0].id;
	  	      req.session.u_email = results[0].u_email;

	  	      res.send('you are logged in');

	  	    }else{
	  	      res.redirect('/');
	  	    }
	  	});
	  }
	});
});

app.get('/another-page', function(req, res){
	var user_info = {
		user_id : req.session.user_id,
		u_email: req.session.u_email
	}

	res.json(user_info);
});

app.get('/logout', function(req, res){
	req.session.destroy(function(err){
		res.send('you are logged out');
	})
});

app.listen(5000, function(){
	console.log('listening on 5000');
});
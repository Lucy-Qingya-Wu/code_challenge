var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require("./../models/user");
var Customer = require("./../models/customer");
var Call = require("./../models/call");
var Appointment = require("./../models/appointment");

// Get homepage
router.get('/register', function(req, res){
	res.render('register');
});

// Add a lead
router.get('/addlead', function(req, res){
	res.render('addlead');
});

// Log a call
router.get('/logcall', function(req, res){
	Customer.getAllCustomers(function(results, err){
		if (err){
			throw err;
		}
	
		if (results.length > 0){
			
			res.render('logcall', {customers: results});

		}else{
			
			res.render('logcall');
		}

	});
	
});

// Save call log 
router.post('/logcall', function(req, res){

	var subject = req.body.subject;
	var customerid = req.body.customerid.toString();
	var datetime = req.body.datetime;
	var note = req.body.note;

	// validationErrors
	req.checkBody('subject', "Subject is required").notEmpty();
	req.checkBody('customerid', "Customer name is required").notEmpty();
	req.checkBody('datetime', "Date and time are required").notEmpty();
	req.checkBody('note', "Note is required").notEmpty();

	var errors = req.validationErrors();

	if (errors){

		Customer.getAllCustomers(function(results, err){
			if (err){
				throw err;
			}
		
			if (results.length > 0){
		
				res.render('logcall', {customers : results, errors : errors});

			}else{
			
				res.render('logcall');
			}

		});

	}
	else{
		var newCall = new Call({
			subject: subject,
			customerid: customerid,
			datetime: datetime,
			note: note
		});

		Call.createCall(newCall, function(call, err){
		
			if(err){throw err};

	
		});

		req.flash("success_msg", 'New call log is saved');
		res.redirect('/');
	}
});

// Make an appointment
router.get('/makeappointment', function(req, res){
	Customer.getAllCustomers(function(results, err){
		if (err){
			throw err;
		}
	
		if (results.length > 0){
			
			res.render('makeappointment', {customers: results});

		}else{
			
			res.render('makeappointment');
		}

	});
});

// Save call log 
router.post('/makeappointment', function(req, res){

	
	var customerid = req.body.customerid.toString();
	var datetime = req.body.datetime;


	// validationErrors

	req.checkBody('customerid', "Customer name is required").notEmpty();
	req.checkBody('datetime', "Date and time are required").notEmpty();


	var errors = req.validationErrors();

	if (errors){

		Customer.getAllCustomers(function(results, err){
			if (err){
				throw err;
			}
		
			if (results.length > 0){
		
				res.render('makeappointment', {customers : results, errors : errors});

			}else{
			
				res.render('makeappointment');
			}

		});

	}
	else{
		var newAppointment = new Appointment({
		
			customerid: customerid,
			datetime: datetime,
	
		});

		Appointment.createAppointment(newAppointment, function(appointment, err){
		
			if(err){throw err};
		
	
		});

		req.flash("success_msg", 'New appointment is scheduled');
		res.redirect('/');
	}
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// View customer list
router.get('/viewcustomers', function(req, res){
		Customer.getAllCustomers(function(results, err){
			if (err){
				throw err;
			}
			
			if (results.length > 0){
			    
				res.render('viewcustomers', {customers : results});

			}else{
			
				res.render('viewcustomers');
			}
		});
});

router.put('/editcustomer', function(req, res){
	
		var id = req.body.id;
		var phonenum = req.body.phonenum;
		Customer.updatePhoneNumber(id, phonenum, function(err){
			if (err){
				throw err;
			}else{
				res.send("Successfully updated the phone number");
			}
		});
});

// Convert lead to customer account
router.post('/addlead', function(req, res){

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var phonenum = req.body.phonenum;



	// validationErrors
	req.checkBody('firstname', "First name is required").notEmpty();
	req.checkBody('lastname', "Last name is required").notEmpty();
	req.checkBody('phonenum', "Phone number is required").notEmpty();

	var errors = req.validationErrors();

	if (errors){
		res.render('addlead', {
			errors:errors
		});
	}
	else{
		var newCustomer = new Customer({
			firstname: firstname,
			lastname: lastname,
			phonenum: phonenum
		});

		Customer.createCustomer(newCustomer, function(customer, err){
		
			if(err){throw err};

		});

		req.flash("success_msg", 'New customer account is created');
		res.redirect('/');
	}
});

// Register User
router.post('/register', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// validationErrors
	req.checkBody('username', "Name is required").notEmpty();
	req.checkBody('password', "Password is required").notEmpty();
	req.checkBody('password2', "Passwords does not match").equals(req.body.password);
	
	var errors = req.validationErrors();

	if (errors){
		res.render('register', {
			errors:errors
		});
	}else{
		var newUser = new User({
			username: username,
			password: password
		});

		User.createUser(newUser, function(user, err){
		
			if(err){throw err};
			
		});

		req.flash("success_msg", 'You are registered and can login');
		res.redirect('/users/login');
	}
});

passport.use(new localStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err, user){
  		if (err) throw err;
  		if(!user){
  			return done(null, false, {message:'Unknown User'});
  		}

  		User.comparePassword(password, user.password, function(err, isMatch){
  			if (err) throw err;
  			if (isMatch){
  				return done(null, user);
  			}else{
  				return done(null, false, {message:'invalid password'});
  			}
  		});
  	});
  })
);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

// we are using local strategy because we are using local database
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash:true}),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;



















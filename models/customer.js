var mongoose = require('mongoose');



var CustomerSchema = mongoose.Schema({
	firstname:{
		type: String
	},
	lastname:{
		type: String
	},
	phonenum:{
		type: String
	}
});

var Customer = module.exports = mongoose.model('Customer', CustomerSchema);

module.exports.createCustomer = function(newCustomer, callback){

	newCustomer.save(function(err){
		callback(newCustomer, err);
	});

};

module.exports.getAllCustomers = function(callback){
	Customer.find(function(err, results) {
		
	    callback(results, err);
	});
};

module.exports.updatePhoneNumber = function(customer_id, new_phone_num, callback){
	var query = {_id: customer_id};
	console.log("in database file");
	Customer.findOne(query, function(err, foundObject){
		if(!foundObject){
			callback(err);
		}else{
			foundObject.phonenum = new_phone_num;
			foundObject.save(function(err){
				callback(err);
			});
		}
	});
};












































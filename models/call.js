var mongoose = require('mongoose');


var CallSchema = mongoose.Schema({
	subject:{
		type: String
	},
	customerid:{
		type: String
	},
	datetime:{
		type: String
	},
	note:{
		type: String
	}
});

var Call = module.exports = mongoose.model('Call', CallSchema);

module.exports.createCall = function(newCall, callback){

	newCall.save(function(err){
		callback(newCall, err);
	});

};

module.exports.getAllCalls = function(callback){
	Call.find(function(err, results) {
		
	    callback(results, err);
	});
};














































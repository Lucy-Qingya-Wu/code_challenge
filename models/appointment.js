var mongoose = require('mongoose');


var AppointmentSchema = mongoose.Schema({

	customerid:{
		type: String
	},
	datetime:{
		type: String
	}

});

var Appointment = module.exports = mongoose.model('Appointment', AppointmentSchema);

module.exports.createAppointment = function(newAppointment, callback){

	newAppointment.save(function(err){
		callback(newAppointment, err);
	});

};

// module.exports.getAllCalls = function(callback){
// 	Call.find(function(err, results) {
		
// 	    callback(results, err);
// 	});
// };









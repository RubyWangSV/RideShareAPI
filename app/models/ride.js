/** 
 * Mongoose Schema for the Entity Ride
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var RideSchema   = new Schema({
    passenger: String,
    driver: Number,
    car: String,
    rideType: String,
    startPoint: { lat: Number, long: Number },
    endPoint: {lat: Number, long: Number},
    requestTime: Number,
    pickupTime: Number,
    dropOffTime: Number,
    status: String,
    fare: Number,
    route:  [{lat:Number, long: Number}]
});

module.exports = mongoose.model('Ride', RideSchema);



/** 
 * Mongoose Schema for the Entity Passenger
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PassengerSchema   = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: String,
    phoneNumber: String
});

module.exports = mongoose.model('Passenger', PassengerSchema);
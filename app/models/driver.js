/** 
 * Mongoose Schema for the Entity Driver
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: String,
    phoneNumber: String,
    drivingLicense: String,
    licensedState: String
});

module.exports = mongoose.model('Driver', DriverSchema);
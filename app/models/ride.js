/** 
 * Mongoose Schema for the Entity Ride
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RideSchema   = new Schema({
    /**
     * Here you need to add the rides properties
     * - passenger (reference, Required)
     * - driver (reference, Required)
     * - car (reference, Required)
     * - rideType (String, [ECONOMY, PREMIUM, EXECUTIVE], Required)
     * - startPoint  Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
     * - endPoint Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
     * - requestTime (Number, TimeStamp, Required)
     * - pickupTime (Number, TimeStamp, Required)
     * - dropOffTime (Number, TimeStamp, Required)
     * - status (String, [REQUESTED, AWAITING_DRIVER, DRIVE_ASSIGNED, IN_PROGRESS, ARRIVED, CLOSED], Required)
     * - fare (Number)
     * - route (series of latitude/longitude values)
     */
});

module.exports = mongoose.model('Ride', RideSchema);
/** 
 * Mongoose Schema for the Entity Car
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarSchema   = new Schema({
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    make: String,
    model: String,
    license: String,
    doorCount: Number
});

module.exports = mongoose.model('Car', CarSchema);
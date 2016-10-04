/** 
 * Mongoose Schema for the Entity PaymentAccount
 * @author Clark Jeria
 * @version 0.0.1
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentAccountSchema   = new Schema({
    accountType: String,
    accountNumber: Number,
    expirationDate: Number,
    nameOnAccount: String, 
    bank: String
});

module.exports = mongoose.model('PaymentAccount', PaymentAccountSchema);
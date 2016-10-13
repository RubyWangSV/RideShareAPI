/** 
 * Example of RESTful API using Express and NodeJS
 * @author Clark Jeria
 * @version 0.0.2
 */

/** BEGIN: Express Server Configuration */
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose    = require('mongoose');
mongoose.connect('mongodb://app:app@ds041566.mlab.com:41566/app_uber_ruby');
/** END: Express Server Configuration */

/** BEGIN: Express Routes Definition */
var router = require('./routes/router');
var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var passengers = require('./routes/passengers');
var paymentAccounts = require('./routes/paymentaccounts');
var rides = require('./routes/rides');
var sessions = require('./routes/sessions');

app.use(function(req,res,next){
	// headers = JSON.stringify(req.headers);
	// console.log("req.path"+req.path);
	if(req.path !== '/api/sessions'){
		if(req.headers.token === 'undefined'){
			res.status(404).json({"errorCode":"","errorMessage":"Missing token.","statusCode":"404"});
			return;
		}
		//console.log("req.headers.token---"+req.headers.token);
		cryptedHash = base64.decode(req.headers.token);
		//console.log("cryptedHash---"+cryptedHash);
		uncryptedHash = CryptoJS.AES.decrypt(cryptedHash,"Secret").toString(CryptoJS.enc.Utf8);
		//console.log("uncryptedHash---"+uncryptedHash);

		var username = sessions.getUserName();
		var expiration = sessions.getExpiration();
		clearString = username+":"+expiration;
		hashString = CryptoJS.HmacSHA1(clearString,"APP");
		console.log("clearString--"+clearString);
		console.log("hashString--"+hashString);

		if(uncryptedHash !== clearString+":"+hashString){
			res.status(400).json({"errorCode":"","errorMessage":"Invalid token.","statusCode":"400"});
			return;
		}
		if(expiration < parseInt(Date.now()/1000)){
			res.status(400).json({"errorCode":"","errorMessage":"Expired token.","statusCode":"400"});
			return;
		}
	}
	next();
});

app.use('/api', cars);
app.use('/api', drivers);
app.use('/api', passengers);
app.use('/api', paymentAccounts);
app.use('/api', rides);
app.use('/api', router);
app.use('/api', sessions);

app.use(function(req, res, next) {
  res.status(404).json({"errorCode": "1001", "errorMessage" : "Invalid Resource Name", "statusCode" : "404"});
  return;  
});
/** END: Express Routes Definition */

/** BEGIN: Express Server Start */
app.listen(port);
console.log('Service running on port ' + port);

module.exports = app;
/** END: Express Server Start */
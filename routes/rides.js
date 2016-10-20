/** 
 * Express Route: /rides
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose     = require('mongoose');

var Ride = require('../app/models/ride');
var func = require('../routes/router');

var RideInfo = 
{
    Property: ["passenger","driver","car","rideType","startPoint","endPoint","requestTime","pickupTime","dropOffTime","status","fare","route"],
    Required: ["yes","yes","yes","yes","yes","yes","yes","yes","yes","yes","no","no"],
    Type: ["ref","ref","ref","string","object","object","number","number","number","string","number","array"]
}
var RideTypeInfo = ["ECONOMY","PREMIUM","EXECUTIVE"];
var RideStatusInfo = ["REQUESTED", "AWAITING_DRIVER", "DRIVE_ASSIGNED", "IN_PROGRESS", "ARRIVED", "CLOSED"];

function checkContentMatch(arr,val){
	return arr.some(function(arrVal){
		return val == arrVal;
	});
}

router.route('/rides') 
    .post(function(req, res){
        /** Make sure required property included in request body*/ 
        var propertyCheck = func.checkRequiredProperty(req,RideInfo);
        if(propertyCheck !== true){
            res.status(400).json({"errorCode": "1051", "errorMessage" : util.format("Missing required parameter %s", propertyCheck)});
            return;
        }
        if(!(checkContentMatch(RideTypeInfo,req.body.rideType))){
            res.status(400).json({"errorCode": "1052", "errorMessage" : "Input ECONOMY, PREMIUM, or EXECUTIVE for rideType." });
            return;        	
        }
        if(!(checkContentMatch(RideStatusInfo,req.body.status))){
        	res.status(400).json({"errorCode": "1053", "errorMessage" : util.format("%s is not a valid status.", req.body.status) });
            return;  
        }
        if(!(req.body.startPoint.hasOwnProperty("lat")) || !(req.body.startPoint.hasOwnProperty("long"))){
            res.status(404).json({"statusCode" : 400,"errorCode" : "1054","errorMessage" : "Missing lat or long info in startPoint."});
            return;   
        }
        if(!(req.body.endPoint.hasOwnProperty("lat")) || !(req.body.endPoint.hasOwnProperty("long"))){
            res.status(404).json({"statusCode" : 400,"errorCode" : "1054","errorMessage" : "Missing lat or long info in endPoint."});
            return;         	
        }        
        // check required
        var ride = new Ride();
        ride.passenger = req.body.passenger;
        ride.driver = req.body.driver;        
        ride.car = req.body.car;        
        ride.rideType = req.body.rideType;        
        ride.startPoint = req.body.startPoint;        
        ride.endPoint = req.body.endPoint;        
        ride.requestTime = req.body.requestTime; 
        ride.pickupTime = req.body.pickupTime;        
        ride.dropOffTime = req.body.dropOffTime;        
        ride.status = req.body.status;  
        ride.fare = req.body.fare;        
        ride.route = req.body.route;        

        ride.save(function(err){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                return;
            }else{
                res.status(201).json(ride);
                return;
            }
        });
    })

router.route('/rides/:ride_id/routePoints') 
    .post(function(req, res){
        if (!mongoose.Types.ObjectId.isValid(req.params.ride_id)) {
            res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
            return;
        }

        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            if (!ride){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            if(!(req.body.hasOwnProperty("route"))){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1056","errorMessage" : "Missing route info."});
                return;            	
            }
            if(!(req.body.route.hasOwnProperty("lat")) || !(req.body.route.hasOwnProperty("long"))){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1054","errorMessage" : "Missing lat or long info in route."});
                return;            	
            }
            if(req.body.route.lat == "undefined" || req.body.route.long == "undefined"){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1055","errorMessage" : "Lat or Long cannot be empty"});
                return; 
            }
        	ride.route.push(req.body.route);
	        ride.save(function(err){
	            if(err){
	                console.log(err);
	                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
	                return;
	            }else{
	                res.status(201).json(ride);
	                return;
	            }
	        });
        });  
    })

router.route('/rides/:ride_id/routePoints') 
    .get(function(req, res){
        if (!mongoose.Types.ObjectId.isValid(req.params.ride_id)) {
            res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
            return;
        }

        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            if (!ride){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            else{
                res.json(ride.route);
                return;
            }
        });  
    })

router.route('/rides/:ride_id/routePoints/current') 
    .get(function(req, res){
        if (!mongoose.Types.ObjectId.isValid(req.params.ride_id)) {
            res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
            return;
        }
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            if (!ride){
                res.status(404).json({"statusCode" : 400,"errorCode" : "1005","errorMessage" : "Given ride does not exist."});
                return;
            }
            else{
            	res.json(ride.route[ride.route.length-1]);
                return;
            }
        });  
    })

/**
 * Here you must add the routes for the Ride entity
 * /rides/:id/routePoints (POST)
 * /rides/:id/routePoints (GET)
 * /rides/:id/routePoint/current (GET)
 */

module.exports = router;
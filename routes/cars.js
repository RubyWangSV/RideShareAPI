/** 
 * Express Route: /cars
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose     = require('mongoose');


var Car = require('../app/models/car');
var func = require('../routes/router');


var CarInfo = 
{
    Property: ["driver","make","model","license","doorCount"],
    Required: ["yes","yes","yes","yes","yes"],
    LengthLimit: [0,18,18,10,0],
    NumberLimit: [0,0,0,0,8],
    Type: ["ref","string","string","string","number"]
}

router.route('/cars') 
    /**
     * GET call for the car entity (multiple).
     * @returns {object} A list of cars. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Car.find(function(err, cars){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : 1020,"errorMessage" :"Cannot find car."});
                return;
            }            
            if(cars == ""){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1020,"errorMessage" :"No car data."});
                return;                
            }
            else{
                res.json(cars);
                return;
            }
        });
    })
    /**
     * POST call for the car entity.
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /** Make sure required property included in request body*/ 
        var propertyCheck = func.checkRequiredProperty(req,CarInfo);
        if (propertyCheck !== true){
            res.status(400).json({"errorCode": "1021", "errorMessage" : util.format("Missing required parameter %s", propertyCheck)});
            return;
        }
        /** Make sure property value - 1. not empty 2.correct type 3. string does not exceed the limit 4. number limit */ 
        for(key in req.body){
            var propertyName = key;
            var propertyRequired = CarInfo.Required[CarInfo.Property.indexOf(propertyName)];
            var PropertyLengthLit = CarInfo.LengthLimit[CarInfo.Property.indexOf(propertyName)];
            var PropertyNumberLit = CarInfo.NumberLimit[CarInfo.Property.indexOf(propertyName)];
            var PropertyType = CarInfo.Type[CarInfo.Property.indexOf(propertyName)];
            var propertycheck = "uncheck";
            for(propertyX in CarInfo.Property){  /** Make sure request body property matches the defined property*/
                if(key == CarInfo.Property[propertyX]){
                    propertycheck = "ok";
                    break;
                }
            }
            if(propertycheck !== "ok"){
                res.status(400).json( {"errorCode":"1023", "errorMessage": util.format("Invalid parameter %s",key) });                                
                return;                
            }
            if(propertyRequired == "yes" && req.body[key] == ""){
                res.status(400).json( {"errorCode":"1024", "errorMessage": util.format("%s cannot be empty.",key) });                                
                return;
            }
            if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){
                res.status(400).json( {"statusCode":400, "errorCode":"1025", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                return;
            }
            if(PropertyType == "string" && !(func.checkStringLength(req,key,PropertyLengthLit))){ //check string limit                 
                res.status(400).json( {"statusCode":400, "errorCode":"1026", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                return;                    
            }
            if(PropertyType == "number" && !(func.checkNumberLimit(req,key,PropertyNumberLit))){ //check number limit
                res.status(400).json( {"statusCode":400, "errorCode":"1027", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                return;                          
            }
        }
        var car = new Car();
        car.driver = req.body.driver;
        car.license = req.body.license;
        car.doorCount = req.body.doorCount;
        car.make = req.body.make;
        car.model = req.body.model;

        car.save(function(err){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                return;
            }else{
                res.status(201).json(car);
                return;
            }
        });
    });

/** 
 * Express Route: /cars/:car_id
 * @param {string} car_id - Id Hash of Car Object
 */
router.route('/cars/:car_id')
    /**
     * GET call for the car entity (single).
     * @returns {object} the car with Id car_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */

        if (!mongoose.Types.ObjectId.isValid(req.params.car_id)) {
            res.status(404).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
            return;
        }

        Car.findById(req.params.car_id, function(err, car){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
                return;
            }
            if (!car){
                res.status(404).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
                return;
            }
            else{
                res.json(car);
                return;
            }
        });  
    })
    /**
     * PATCH call for the car entity (single).
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Car.findById(req.params.car_id, function(err, car){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
            }           
            if (!car){
                res.status(404).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
                return;
            }
            else{
                for(var key in req.body) {
                    CarInfo.Property.forEach(function(value,index){
                        var PropertyType = CarInfo.Type[index];
                        var PropertyLengthLit = CarInfo.LengthLimit[index];
                        var PropertyNumberLit = CarInfo.NumberLimit[index];
                        if (key == value && req.body[key]!== ""){
                            if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){ // Make type is correct
                                res.status(400).json( {"statusCode":400, "errorCode":"1025", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                                return;
                            }
                            if(PropertyType == "string"){ //check string limit                 
                                if(req.body[key].length > PropertyLengthLit){
                                    res.status(400).json( {"statusCode":400, "errorCode":"1026", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                                    return;                    
                                }
                            }
                            if(PropertyType == "number"){ //check number limit
                                if(req.body[key]<=0 || req.body[key]>PropertyNumberLit){
                                    res.status(400).json( {"statusCode":400, "errorCode":"1027", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                                    return;                          
                                }
                            }
                            car[value]=req.body[key];  //assign value
                        }
                    });
                }
                car.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                        return;
                    }else{
                        res.json(car);
                        return;
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the car entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        Car.findById(req.params.car_id, function(err, car){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
                return;
            }
            if(!car){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given car does not exist."});
                return;                        
            }
            else{
                Car.remove({
                    _id : req.params.car_id
                }, function(err, car){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5002", "errorMessage": "Cannot delete successfully."});
                        return;
                    }
                    else{
                        res.json({"message" : "Car Deleted"});
                        return;
                    }
                });
            }            
        });
    });

module.exports = router;
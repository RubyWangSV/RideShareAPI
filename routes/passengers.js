/** 
 * Express Route: /passengers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');


var Passenger = require('../app/models/passenger');
var func = require('../routes/router');

var PassengerInfo = 
{
    Property: ["firstName","lastName","emailAddress","password","addressLine1","addressLine2","city","state","zip","phoneNumber"],
    Required: ["no","no","yes","yes","no","no","no","no","no","yes"],
    LengthLimit: [15,15,-2,-1,50,50,50,2,5,-2], //-1:specialstring(password), -2:reegex (emailAddress,phoneNumber), 0 number
    NumberLimit: [], //no number in PassengerInfo
    Type: ["string","string","string","string","string","string","string","string","string","string"]
}



router.route('/passengers') 
    /**
     * GET call for the passenger entity (multiple).
     * @returns {object} A list of passengers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Passenger.find(function(err, passengers){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode" : 404,"errorCode" : 1040,"errorMessage" :"Cannot find passenger."});
                return;
            }
            if(passengers == ""){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1040,"errorMessage" :"No passenger data."});                
            }
            else{
                res.json(passengers);
                return;
            }
        });
    })
    /**
     * POST call for the passenger entity.
     * @param {string} firstName - The first name of the new passenger
     * @param {string} lastName - The last name of the new passenger
     * @param {date} dateOfBirth - The date of birth of the new passenger
     * @param {string} username - The username of the new passenger
     * @param {string} password - The password of the new passenger
     * @param {string} addressLine1 - The address line 1 of the new passenger
     * @param {string} addressLine2 - The address line 2 of the new passenger
     * @param {string} city - The city of the new passenger
     * @param {string} state - The state of the new passenger
     * @param {number} zip - The zip code of the new passenger
     * @param {number} phoneNumber - The phone number of the new passenger
     * @returns {object} A message and the passenger created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){

        /** Make sure property included in request body*/ 
        var propertyCheck = func.checkRequiredProperty(req,PassengerInfo);
        if (propertyCheck !== true){
            res.status(400).json({"errorCode": "1041", "errorMessage" : util.format("Missing required parameter %s", propertyCheck)});
            return;
        }
        /** Make sure property value - 1. not empty 2.correct type 3. string does not exceed the limit 4. number limit */ 
        for(key in req.body){
            var propertyName = key;
            var propertyRequired = PassengerInfo.Required[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyLengthLit = PassengerInfo.LengthLimit[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyNumberLit = PassengerInfo.NumberLimit[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyType = PassengerInfo.Type[PassengerInfo.Property.indexOf(propertyName)];
            var propertycheck = "uncheck";
            for(propertyX in PassengerInfo.Property){  //Make sure request property matches the defined property
                if(key == PassengerInfo.Property[propertyX]){
                    propertycheck = "ok";
                    break;
                }
            }
            if(propertycheck !== "ok"){
                res.status(400).json( {"errorCode":"1043", "errorMessage": util.format("Invalid parameter %s",key) });                                
                return;                
            }
            if(propertyRequired == "yes" && req.body[key]==""){ //make sure value is not empty
                res.status(400).json( {"errorCode":"1044", "errorMessage": util.format("%s cannot be empty.",key) });                                
                return;
            }else{
                if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){ //check type
                    res.status(400).json( {"statusCode":400, "errorCode":"1045", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                    return;
                }
                if(PropertyType == "string" && PropertyLengthLit>0 && !(func.checkStringLength(req,key,PropertyLengthLit))){ //check string limit                 
                    res.status(400).json( {"statusCode":400, "errorCode":"1046", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                    return;                    
                }                
                if(PropertyType == "number" && !(func.checkNumberLimit(req,key,PropertyNumberLit))){ //check number limit
                    res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                    return;                          
                }                
                if(propertyName == "emailAddress" && !(func.checkEmail(req,key))){ //check email format
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Email format is incorrect." });
                    return;                             
                }
                if(propertyName == "phoneNumber" && !(func.checkPhoneNumber(req,key))){ //check phoneNumber format
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Phone number format is XXX-XXX-XXXX." });
                    return;
                }
                if(propertyName == "password" && !(func.checkPassword(req,key))){ //check password format
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Password must be 8-16 length." });  
                    return;
                }
            }
        }
        var passenger = new Passenger();
        passenger.firstName = req.body.firstName;
        passenger.lastName = req.body.lastName;
        passenger.username = req.body.username;
        passenger.emailAddress = req.body.emailAddress;
        passenger.password = req.body.password;
        passenger.addressLine1 = req.body.addressLine1;
        passenger.addressLine2 = req.body.addressLine2;
        passenger.city = req.body.city;
        passenger.state = req.body.state;
        passenger.zip = req.body.zip;
        passenger.phoneNumber = req.body.phoneNumber;

        passenger.save(function(err){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
            }else{
                res.json(passenger)
            }
        });
    });

/** 
 * Express Route: /passengers/:passenger_id
 * @param {string} passenger_id - Id Hash of passenger Object
 */
router.route('/passengers/:passenger_id')
    /**
     * GET call for the passenger entity (single).
     * @returns {object} the passenger with Id passenger_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        if (!mongoose.Types.ObjectId.isValid(req.params.passenger_id)) {
            res.status(404).json({"statusCode" : 404,"errorCode" : 1004,"errorMessage" :"Given passenger does not exist."});
            return;
        }
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : 1004,"errorMessage" :"Given passenger does not exist."});
                return;
            }
            if (!passenger){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1004,"errorMessage" :"Given passenger does not exist."});
                return;
            }
            else{
                res.status(200).json(passenger);                    
                return;
            }
        });  
    })
    /**
     * PATCH call for the passenger entity (single).
     * @param {string} firstName - The first name of the new passenger
     * @param {string} lastName - The last name of the new passenger
     * @param {date} dateOfBirth - The date of birth of the new passenger
     * @param {string} username - The username of the new passenger
     * @param {string} password - The password of the new passenger
     * @param {string} addressLine1 - The address line 1 of the new passenger
     * @param {string} addressLine2 - The address line 2 of the new passenger
     * @param {string} city - The city of the new passenger
     * @param {string} state - The state of the new passenger
     * @param {number} zip - The zip code of the new passenger
     * @param {number} phoneNumber - The phone number of the new passenger
     * @returns {object} A message and the passenger updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1004,"errorMessage" : "Given passenger does not exist."});
                return;
            }
            if (!passenger){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1004,"errorMessage" : "Given passenger does not exist."});
                return;
            }
            else{
                for(var key in req.body) {
                    PassengerInfo.Property.forEach(function(value,index){
                        var propertyName = value;
                        var PropertyType = PassengerInfo.Type[index];
                        var PropertyLengthLit = PassengerInfo.LengthLimit[index];
                        var PropertyNumberLit = PassengerInfo.NumberLimit[index];
                        if (key == value && req.body[key]!== ""){
                            if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){ //check type
                                res.status(400).json( {"statusCode":400, "errorCode":"1045", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                                return;
                            }
                            if(PropertyType == "string" && PropertyLengthLit>0 && !(func.checkStringLength(req,key,PropertyLengthLit))){ //check string limit                 
                                res.status(400).json( {"statusCode":400, "errorCode":"1046", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                                return;                    
                            }                
                            if(PropertyType == "number" && !(func.checkNumberLimit(req,key,PropertyNumberLit))){ //check number limit
                                res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                                return;                          
                            }                
                            if(propertyName == "emailAddress" && !(func.checkEmail(req,key))){ //check email format
                                res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Email format is incorrect." });
                                return;                             
                            }
                            if(propertyName == "phoneNumber" && !(func.checkPhoneNumber(req,key))){ //check phoneNumber format
                                res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Phone number format is XXX-XXX-XXXX." });
                                return;
                            }
                            if(propertyName == "password" && !(func.checkPassword(req,key))){ //check password format
                                res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Password must be 8-16 length." });  
                                return;
                            }
                            passenger[propertyName]=req.body[key];  //assign value          
                        }                        
                    })
                }
                passenger.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                        return;
                    }else{
                        res.json({"message" : "Passenger Updated", "passengerUpdated" : passenger});
                        return;
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the passenger entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Passenger.remove({
            _id : req.params.passenger_id
        }, function(err, passenger){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5002", "errorMessage": "Cannot delete successfully."});
                return;
            }else{
                res.json({"message" : "Passenger Deleted"});
                return;
            }
        });
    });

module.exports = router;
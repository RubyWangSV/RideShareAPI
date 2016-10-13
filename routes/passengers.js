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

var PassengerInfo = 
{
    Property: ["firstName","lastName","emailAddress","password","addressLine1","addressLine2","city","state","zip","phoneNumber"],
    Required: ["no","no","yes","yes","no","no","no","no","no","yes"],
    LengthLimit: [15,15,-2,-1,50,50,50,2,5,-2], //-1:specialstring(password), -2:reegex (emailAddress,phoneNumber), 0 number
    NumberLimit: [],
    Type: ["string","string","string","string","string","string","string","string","string","string"]
}

var checkEmail = function(request,respnose,key){
    if(/[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/.test(request.body[key]))
        return true;
    else
        return false;
}

var checkPhoneNumber = function(request,response,key){
    if(/\d{3}[-]\d{3}[-]\d{4}/.test(request.body[key]))
        return true;                         
    else
        return false;
}

var checkPassword = function(request,response,key){
    if(request.body[key].length>=8 &&request.body[key].length<=16)
        return true;
    else
        return false;
}

router.route('/passengers') 
    /**
     * GET call for the passenger entity (multiple).
     * @returns {object} A list of passengers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Passenger.find(function(err, passengers){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode" : 404,"errorCode" : 1040,"errorMessage" :"Cannot find passenger."});
                return;
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
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
        for(i=0;i<PassengerInfo.Property.length;i++){
            var propertyName = PassengerInfo.Property[i];
            var PropertyType = PassengerInfo.Type[PassengerInfo.Property.indexOf(propertyName)];
            if(typeof req.body[propertyName] === 'undefined' && PropertyType !== "ref"){
                res.status(400).json({"errorCode": "1041", "errorMessage" : util.format("Missing required parameter %s", PassengerInfo.Property[i]), "statusCode" : "422"});
                return;
            }
        }
        /** Make sure property value - 1. not empty 2.correct type 3. string does not exceed the limit 4. number limit */ 
        for(key in req.body){
            var propertyName = key;
            var propertyRequired = PassengerInfo.Required[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyLengthLit = PassengerInfo.LengthLimit[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyNumberLit = PassengerInfo.NumberLimit[PassengerInfo.Property.indexOf(propertyName)];
            var PropertyType = PassengerInfo.Type[PassengerInfo.Property.indexOf(propertyName)];
            var propertycheck;
            for(propertyX in PassengerInfo.Property){  /** Make sure request property matches the defined property*/
                if(key == PassengerInfo.Property[propertyX]){
                    propertycheck = "ok";
                    break;
                }
            }
            if(propertycheck !== "ok"){
                res.status(400).json( {"errorCode":"1043", "errorMessage": util.format("Invalid parameter %s",key) });                                
                return;                
            }
            if(propertyRequired == "yes" && req.body[key]==""){
                res.status(400).json( {"errorCode":"1044", "errorMessage": util.format("%s cannot be empty.",key) });                                
                return;
            }else{
                if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){
                    res.status(400).json( {"statusCode":400, "errorCode":"1045", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                    return;
                }
                if(PropertyType == "string" && PropertyLengthLit>0){ //check string limit                 
                    if(req.body[key].length > PropertyLengthLit){
                        //console.log(PassengerInfo.LengthLimit[PassengerInfo.Property.indexOf("make")]);
                        res.status(400).json( {"statusCode":400, "errorCode":"1046", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                        return;                    
                    }
                }
                if(PropertyType == "number"){ //check number limit
                    if(req.body[key]<=0 || req.body[key]>PropertyNumberLit){
                        res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                        return;                          
                    }
                }
                if(propertyName == "emailAddress" && !(checkEmail(req,res,key))){
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Email format is incorrect." });
                    return;                             
                }
                if(propertyName == "phoneNumber" && !(checkPhoneNumber(req,res,key))){
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "Phone number format is XXX-XXX-XXXX." });
                    return;
                }
                if(propertyName == "password" && !(checkPassword(req,res,key))){
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
        /**
         * Add extra error handling rules here
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.passenger_id)) {
            res.status(404).json({"statusCode" : 404,"errorCode" : 1004,"errorMessage" :"Given passenger does not exist."});
            console.log("here");
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
        /**
         * Add aditional error handling here
         */
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1004,"errorMessage" : "Given passenger does not exist."});
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        PassengerInfo.Property.forEach(function(value,index){
                            var PropertyType = PassengerInfo.Type[index];
                            var PropertyLengthLit = PassengerInfo.LengthLimit[index];
                            var PropertyNumberLit = PassengerInfo.NumberLimit[index];
                            if (key == value){
                                if(typeof req.body[key] !== PropertyType && PropertyType !== "ref"){ // Make type is correct
                                    res.status(400).json( {"statusCode":400, "errorCode":"1045", "errorMessage":util.format("Value of %s must be a %s",key,PropertyType) } );
                                    return;
                                }
                                if(PropertyType == "string"&& PropertyLengthLit>0){ //check string limit                 
                                    if(req.body[key].length > PropertyLengthLit){
                                        res.status(400).json( {"statusCode":400, "errorCode":"1046", "errorMessage": util.format("%s exceeds size limit %s",key,PropertyLengthLit) });
                                        return;                    
                                    }
                                }
                                if(PropertyType == "number"){ //check number limit
                                    if(req.body[key]<=0 || req.body[key]>PropertyNumberLit){
                                        res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": util.format("%s must be within 1~%s",key,PropertyNumberLit) });
                                        return;                          
                                    }
                                }
                                passenger[value]=req.body[key];  //assign value
                            }
                        });
                    }
                }
                passenger.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                    }else{
                        res.json({"message" : "Passenger Updated", "passengerUpdated" : passenger});
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
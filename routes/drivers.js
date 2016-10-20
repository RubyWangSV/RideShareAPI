/** 
 * Express Route: /drivers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');


var Driver = require('../app/models/driver');
var func = require('../routes/router');

var DriverInfo = 
{
    Property: ["firstName","lastName","emailAddress","password","addressLine1","addressLine2","city","state","zip","phoneNumber","drivingLicense","licensedState"],
    Required: ["no","no","yes","yes","no","no","no","no","no","yes","yes","yes"],
    LengthLimit: [15,15,-2,-1,50,50,50,2,5,-2,-1,2], //-1:specialstring(password), -2:reegex (emailAddress,phoneNumber), 0 number
    NumberLimit: [], //no number in DriverInfo
    Type: ["string","string","string","string","string","string","string","string","string","string","string","string"]
}

router.route('/drivers') 
    /**
     * GET call for the driver entity (multiple).
     * @returns {object} A list of drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Driver.find(function(err, drivers){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode" : 500,"errorCode" : 1030,"errorMessage" :"Cannot find driver."});
                return;
            }
            if(drivers == ""){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1030,"errorMessage" :"No driver data."});
                return;                
            }
            else{
                res.json(drivers);
            }
        });
    })  
    /**
     * POST call for the driver entity.
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /** Make sure property included in request body*/ 
        var propertyCheck = func.checkRequiredProperty(req,DriverInfo);
        if (propertyCheck !== true){
            res.status(400).json({"errorCode": "1041", "errorMessage" : util.format("Missing required parameter %s", propertyCheck)});
            return;
        }
        /** Make sure property value - 1. not empty 2.correct type 3. string does not exceed the limit 4. number limit */ 
        for(key in req.body){
            var propertyName = key;
            var propertyRequired = DriverInfo.Required[DriverInfo.Property.indexOf(propertyName)];
            var PropertyLengthLit = DriverInfo.LengthLimit[DriverInfo.Property.indexOf(propertyName)];
            var PropertyNumberLit = DriverInfo.NumberLimit[DriverInfo.Property.indexOf(propertyName)];
            var PropertyType = DriverInfo.Type[DriverInfo.Property.indexOf(propertyName)];
            var propertycheck = "uncheck";
            for(propertyX in DriverInfo.Property){  //Make sure request property matches the defined property
                if(key == DriverInfo.Property[propertyX]){
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
                if(propertyName == "drivingLicense" && !(func.check8to16(req,key))){ //check drivinglicense format
                    res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "drivingLicense must be 8-16 length." });  
                    return;
                }
            }
        }
        var driver = new Driver();
        driver.firstName = req.body.firstName;
        driver.lastName = req.body.lastName;
        driver.dateOfBirth = req.body.dateOfBirth;
        driver.licenseType = req.body.licenseType;
        driver.username = req.body.username;
        driver.emailAddress = req.body.emailAddress;
        driver.password = req.body.password;
        driver.addressLine1 = req.body.addressLine1;
        driver.addressLine2 = req.body.addressLine2;
        driver.city = req.body.city;
        driver.state = req.body.state;
        driver.zip = req.body.zip;
        driver.phoneNumber = req.body.phoneNumber;

        driver.save(function(err){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
            }else{
                res.status(201).json(driver);
            }
        });
    });


/** 
 * Express Route: /drivers/:driver_id
 * @param {string} driver_id - Id Hash of driver Object
 */
router.route('/drivers/:driver_id')
    /**
     * GET call for the driver entity (single).
     * @returns {object} the driver with Id driver_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.driver_id)) {
            res.status(404).send({errorCode: 4000});
            return;
        }
        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : "1003","errorMessage" :"Given driver does not exist."});
                return;
            }
            if (!driver){
                res.status(404).json({"statusCode" : 404,"errorCode" : "1003","errorMessage" :"Given driver does not exist."});
                return;                
            }
            else{
                res.status(200).json(driver);
                return;
            }
        });  
    })  
    /**
     * PATCH call for the driver entity (single).
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){        
        /**
         * Add aditional error handling here
         */

        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : "1003","errorMessage" : "Given driver does not exist."});
                return;
            }
            if(!driver){
                res.status(404).json({"statusCode" : 404,"errorCode" : "1003","errorMessage" : "Given driver does not exist."});
                return;
            }
            else{
                for(var key in req.body) {
                    DriverInfo.Property.forEach(function(value,index){
                        var propertyName = value;
                        var PropertyType = DriverInfo.Type[index];
                        var PropertyLengthLit = DriverInfo.LengthLimit[index];
                        var PropertyNumberLit = DriverInfo.NumberLimit[index];
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
                            if(propertyName == "drivingLicense" && !(func.check8to16(req,key))){ //check drivinglicense format
                                res.status(400).json( {"statusCode":400, "errorCode":"1048", "errorMessage": "drivingLicense must be 8-16 length." });  
                                return;
                            }
                            driver[propertyName]=req.body[key];  //assign value          
                        }                        
                    })
                }
                driver.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                        return;
                    }else{
                        res.json({"message" : "Driver Updated", "driverUpdated" : driver});
                        return;
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the driver entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given driver does not exist."});
                return;
            }
            if(!driver){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1002,"errorMessage" : "Given driver does not exist."});
                return;                        
            }
            else{        
                Driver.remove({
                    _id : req.params.driver_id
                }, function(err, driver){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5002", "errorMessage": "Cannot delete successfully."});
                    }else{
                        res.json({"message" : "Driver Deleted"});
                    }
                });
            }
        });
    });

module.exports = router;
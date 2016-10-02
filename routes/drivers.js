/** 
 * Express Route: /drivers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Driver = require('../app/models/driver');

router.route('/drivers') 
    /**
     * GET call for the driver entity (multiple).
     * @returns {object} A list of drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.find(function(err, drivers){
            if(err){
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            }else{
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
        if(typeof req.body.firstName === 'undefined'){
            res.status(422).json({"errorCode": "1002", "errorMessage" : util.format("Missing required parameter %s", "firstName"), "statusCode" : "422"});
            return;
        }
        /**
         * Add aditional error handling here
         */

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
                res.status(500).send(err);
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
        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(driver);
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

        Driver.findById(req.params.driver_id, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        if(key == 'firstName'){
                            /**
                             * Add extra error handling rules here
                             */
                            driver.firstName = req.body.firstName;
                        }
                        if(key == 'lastName'){
                            /**
                             * Add extra error handling rules here
                             */
                            driver.lastName = req.body.lastName;
                        }
                        /**
                         * Repeat for the other properties
                         */
                    }
                }

                driver.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Driver Updated", "driverUpdated" : driver});
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
        /**
         * Add extra error handling rules here
         */
        Driver.remove({
            _id : req.params.driver_id
        }, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Driver Deleted"});
            }
        });
    });

module.exports = router;
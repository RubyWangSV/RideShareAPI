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
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            }else{
                res.json(passengers);
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
        if (typeof req.body.emailAddress === "undefined" || req.body.firstName.length > 15) {
            res.sendStatus(400);
            return;

        }
        /**
         * Add aditional error handling here
         */

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
                res.status(500).send(err);
            }else{
                res.status(201).json(passenger);
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
            res.status(404).send({errorCode: 4000});
            return;
        }

        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).send(err);
            }else{
                if (!passenger)
                    res.status(404).send({});

                else
                res.json(passenger);
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
        Passenger.findById(req.params.passenger_id, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        if(key == 'firstName'){
                            /**
                             * Add extra error handling rules here
                             */
                            passenger.firstName = req.body.firstName;
                        }
                        if(key == 'lastName'){
                            /**
                             * Add extra error handling rules here
                             */
                            passenger.lastName = req.body.lastName;
                        }
                        /**
                         * Repeat for the other properties
                         */
                    }
                }

                passenger.save(function(err){
                    if(err){
                        res.status(500).send(err);
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
                res.status(500).send(err);
            }else{
                res.json({"message" : "Passenger Deleted"});
            }
        });
    });

module.exports = router;
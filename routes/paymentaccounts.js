/** 
 * Express Route: /paymentaccounts
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose     = require('mongoose');

var PaymentAccount = require('../app/models/paymentaccount');
var func = require('../routes/router');

var PaymentInfo =
{
    Property: ["accountType","accountNumber","expirationDate","nameOnAccount","bank"],
    Required: ["yes","yes","passengeraccount","yes","drirveraccount"],
    LengthLimit: [18,18,0,18,18], //accountNumber - number -18 digit
    // NumberLimit: [0,0,0,0,0], 
    Type: ["string","number","number","string","string"]
}

router.route('/paymentaccounts') 
    /**
     * GET call for the paymentAccount entity (multiple).
     * @returns {object} A list of paymentAccounts. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.find(function(err, paymentAccounts){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : 1020,"errorMessage" :"Cannot find payment account."});
                return;
            }
            if(paymentAccounts == ""){
                res.status(404).json({"statusCode" : 404,"errorCode" : 1020,"errorMessage" :"No payment account data."});
                return;                
            }
            else{
                res.json(paymentAccounts);
            }
        });
    })

    /**
     * POST call for the paymentAccount entity.
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /** Make sure property included in request body*/ 
        var propertyCheck = func.checkRequiredProperty(req,PaymentInfo);
        if (propertyCheck !== true){
            res.status(400).json({"errorCode": "1041", "errorMessage" : util.format("Missing required parameter %s", propertyCheck)});
            return;
        }
        /** Make sure property value - 1. not empty 2.correct type 3. string does not exceed the limit 4. number limit */ 
        for(key in req.body){
            var propertyName = key;
            var propertyRequired = PaymentInfo.Required[PaymentInfo.Property.indexOf(propertyName)];
            var PropertyLengthLit = PaymentInfo.LengthLimit[PaymentInfo.Property.indexOf(propertyName)];
            var PropertyType = PaymentInfo.Type[PaymentInfo.Property.indexOf(propertyName)];
            var propertycheck = "uncheck";
            for(propertyX in PaymentInfo.Property){  //Make sure request property matches the defined property
                if(key == PaymentInfo.Property[propertyX]){
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
                if(propertyName == "accountNumber" && req.body[key].toString().length !== 18) { //check number limit
                    res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": "accountNumber should be 18 digit." });
                    return;                          
                } 
            }
        }

        var paymentAccount = new PaymentAccount();
        paymentAccount.accountType = req.body.accountType;
        paymentAccount.accountNumber = req.body.accountNumber;
        paymentAccount.expirationDate = req.body.expirationDate;
        paymentAccount.nameOnAccount = req.body.nameOnAccount;
        paymentAccount.bank = req.body.bank;

        paymentAccount.save(function(err){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                return;
            }else{
                res.status(201).json({"message" : "PaymentAccount Created", "paymentAccountCreated" : paymentAccount});
                return;
            }
        });
    });

/** 
 * Express Route: /paymentaccounts/:paymentaccount_id
 * @param {string} paymentaccount_id - Id Hash of PaymentAccount Object
 */
router.route('/paymentaccounts/:paymentaccount_id')
    /**
     * GET call for the paymentAccount entity (single).
     * @returns {object} the paymentaccount with Id paymentaccount_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){        
        if (!mongoose.Types.ObjectId.isValid(req.params.paymentaccount_id)) {
            res.status(404).json({"statusCode" : 400,"errorCode" : 1006,"errorMessage" : "Given payment does not exist."});
            return;
        }
        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentAccount){
            if(err){
                console.log(err);
                res.status(500).json({"statusCode" : 500,"errorCode" : 1006,"errorMessage" : "Given payment does not exist."});
                return;
            }
            if(!paymentAccount){
                res.status(404).json({"statusCode" : 400,"errorCode" : 1006,"errorMessage" : "Given payment does not exist."});
                return;                
            }
            else{
                res.json(paymentAccount);
                return;
            }
        });  
    })
    /**
     * PATCH call for the paymentAccount entity (single).
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @returns {object} A message and the paymentaccount updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){

        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentAccount){
            if(err){
                res.status(500).json({"statusCode" : 500,"errorCode" : 1006,"errorMessage" : "Given payment account does not exist."});
            }           
            if (!paymentAccount){
                res.status(404).json({"statusCode" : 400,"errorCode" : 1006,"errorMessage" : "Given payment account does not exist."});
                return;
            }
            else{
                for(var key in req.body) {
                    PaymentInfo.Property.forEach(function(value,index){
                        var PropertyType = PaymentInfo.Type[index];
                        var PropertyLengthLit = PaymentInfo.LengthLimit[index];
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
                            if(key == "accountNumber" && req.body[key].toString().length !== 18) { //check number limit
                                res.status(400).json( {"statusCode":400, "errorCode":"1047", "errorMessage": "accountNumber should be 18 digit." });
                                return;                          
                            } 
                            paymentAccount[value]=req.body[key];  //assign value
                        }
                    });
                }
                paymentAccount.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5001", "errorMessage": "Cannot save successfully."});
                    }else{
                        res.json({"message" : "PaymentAccount Updated", "paymentAccountUpdated" : paymentAccount});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the paymentaccount entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){  
        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentAccount){
            if(err){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1006,"errorMessage" : "Given payment account does not exist."});
                return;
            }
            if(!paymentAccount){
                res.status(500).json({"statusCode" : 400,"errorCode" : 1006,"errorMessage" : "Given payment account does not exist."});
                return;                        
            }
            else{   
                PaymentAccount.remove({
                    _id : req.params.paymentaccount_id
                }, function(err, paymentaccount){
                    if(err){
                        console.log(err);
                        res.status(500).json({"statusCode":500, "errorCode":"5002", "errorMessage": "Cannot delete successfully."});
                        return;
                    }else{
                        res.json({"message" : "PaymentAccount Deleted"});
                    }
                });
            }
        });
    });

module.exports = router;
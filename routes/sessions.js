var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');

var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

var router = express.Router();

var username = "ruby";
var password = "cmusv-app"
var expiration = (parseInt(Date.now()/1000) + 3600); // expire in an hour (milliseconds since 1970/01/01->sec since 1970->sec+1hr)

router.route('/sessions')
    .post(function(req, res){
        if(req.body.username == undefined){
            res.status(400).json( {"statusCode":400, "errorCode":"9001", "errorMessage": "Username is required to get a token." });  
            return;                
        }
        if(req.body.password == undefined){
            res.status(400).json( {"statusCode":400, "errorCode":"9002", "errorMessage": "Password is required to get a token." });  
            return;                
        }
        for( x in req.body){
            if(!( x == "username" || x== "password")){
                res.status(400).json( {"statusCode":400, "errorCode":"9004", "errorMessage": "Please enter only username and password." });  
                return;                   
            }
        }        
        if(req.body.username !== username || req.body.password !== password){
            res.status(400).json( {"statusCode":400, "errorCode":"9003", "errorMessage": "Invalid username or password." });  
            return;             
        }

        clearString = username+":"+expiration;
        hashString = CryptoJS.HmacSHA1(clearString,"APP");
        cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,"Secret").toString();
        response = {token: base64.encode(cryptString)}

        res.status(200).json(response);
        return;
    })

router.getUserName = function() { console.log("session-username"+username); return username;}
router.getExpiration = function() { console.log("session-expiration"+expiration); return expiration;}

module.exports = router;

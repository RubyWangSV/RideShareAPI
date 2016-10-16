var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');

var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

var router = express.Router();

var username = "ruby";
var expiration = (parseInt(Date.now()/1000) + 3600); // expire in an hour (milliseconds since 1970/01/01->sec since 1970->sec+1hr)

router.route('/sessions')

    .post(function(req, res){

        if(req.body.username !== "undefined"){
            if(/[a-zA-Z0-9_.]/.test(req.body.username))
                username = req.body.username;
            else{
                res.status(400).json( {"statusCode":400, "errorCode":"4000", "errorMessage": "User name can only contain number, letter, or ._." });  
                return;                
            }
        }
        if(req.body.password !== "undefined"){
            if(req.body.password.length>=8 &&req.body.password.length<=16){
            }
            else{
                res.status(400).json( {"statusCode":400, "errorCode":"4000", "errorMessage": "Password must be 8-16 length." });  
                return;                
            }
        }
        clearString = username+":"+expiration;
        //console.log("clearString@session.js---"+clearString);
        hashString = CryptoJS.HmacSHA1(clearString,"APP");
        //console.log("hashString@session.js---"+hashString);
        cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,"Secret").toString();
        //console.log("cryptString@session.js---"+cryptString);
        response = {token: base64.encode(cryptString)}
        //console.log("response.token@session.js---"+response.token);

        res.status(200).json(response);
        return;
    })

router.getUserName = function() {  return username;}
router.getExpiration = function() {  return expiration;}

module.exports = router;

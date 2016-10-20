/** 
 * Express Route: /
 * @author Clark Jeria
 * @version 0.0.2
 */
var express = require('express');
var router = express.Router();

/**
 * Initial route of the API for connection testing purpouses
 * @returns {object} A string message.
 */
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to APP Uber CMU!' });   
});

//Global functions

router.checkRequiredProperty = function(request,EntityInfo){
    for(i=0;i<EntityInfo.Property.length;i++){
        var propertyName = EntityInfo.Property[i];
        var propertyRequired = EntityInfo.Required[EntityInfo.Property.indexOf(propertyName)];
        var PropertyType = EntityInfo.Type[EntityInfo.Property.indexOf(propertyName)];
        if(propertyRequired == "yes" && typeof request.body[propertyName] === 'undefined' && PropertyType !== "ref"){
            return propertyName;
        }
    }
    return true;
}

router.checkStringLength = function(request,key,limit){
	if(request.body[key].length <= limit)
		return true;
	else
		return false;
}

router.checkNumberLimit = function(request,key,limit){
	if(request.body[key]>0 && request.body[key]<=limit)
		return true;
	else
		return false;
}

router.checkEmail = function(request,key){
    if(/[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/.test(request.body[key]))
        return true;
    else
        return false;
}

router.checkPhoneNumber = function(request,key){
    if(/\d{3}[-]\d{3}[-]\d{4}/.test(request.body[key]))
        return true;                         
    else
        return false;
}

router.checkPassword = function(request,key){
    if(request.body[key].length>=8 &&request.body[key].length<=16)
        return true;
    else
        return false;
}

module.exports = router;
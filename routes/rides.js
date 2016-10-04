/** 
 * Express Route: /rides
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Car = require('../app/models/ride');

/**
 * Here you must add the routes for the Ride entity
 * /rides/:id/routePoints (POST)
 * /rides/:id/routePoints (GET)
 * /rides/:id/routePoint/current (GET)
 */

module.exports = router;
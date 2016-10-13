var supertest = require('supertest'),
assert = require('assert'),
app = require('../server.js');
var mongoose     = require('mongoose');


carOne = {
    make: "Ford",
    model: "Taurus",
    license: "YUE7839",
    doorCount: 4
};

var carOneId;

driverOne = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-98989@example.com",
  password: "anypwd1234",
  addressLine1: "454 Main Street",
  addressLine2: "",
  city: "Anytown",
  state: "AS",
  zip: "83874",
  phoneNumber: "408-555-2737",
  drivingLicense: "D162373",
  licensedState: "CA"
};

var driverOneId;

passengerOne = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-9876345@example.com",
  password: "anypwd1234",
  addressLine1: "454 Main Street",
  addressLine2: "",
  city: "Anytown",
  state: "AS",
  zip: "83874",
  phoneNumber: "408-555-2737",
};

var pasesngerOneId;

exports.cars01_should_create_car = function(done){
  supertest(app)
  .post('/api/cars')
  .send(carOne)
  .expect(201)
  .end(function(err, response){
      assert.ok(typeof response.body === 'object');
      assert.ok(response.body.make === "Ford");
      carOneId = response.body._id;
    return done();
  });
};

exports.drivers01_should_create_driver = function(done){
  supertest(app)
  .post('/api/drivers')
  .send(driverOne)
  .expect(201)
  .end(function(err, response){
    assert.ok(typeof response.body === 'object');
    driverOneId = response.body._id;
    return done();
  });
};

exports.passengers01_should_create_passenger = function(done){
  supertest(app)
  .post('/api/passengers')
  .send(passengerOne)
  .expect(201)
  .end(function(err, response){
    assert.ok(typeof response.body === 'object');
    pasesngerOneId = response.body._id;
    return done();
  });
};

/*
Rides test here
*/
rideOne = {
  passenger : passengerOne,
  driver : driverOne,
  car : carOne,
  rideType : "ECONOMY",
  startPoint : {lat: "123456789", long:"123456789"},
  endPoint : {},
  requestTime: "123456789",
  pickupTime : "123456789",
  dropOffTime : "0",
  status : "IN_PROGRESS",
  fare : 0,
  route: [{lat: "123456789", long:"123456789"}]
};

exports.rides01_should_create_ride = function(done){
  supertest(app)
  .post('/api/rides')
  .send(rideOne)
  .expect(201)
  .end(function(err, response){
    assert.ok(typeof response.body === 'object');
    pasesngerOneId = response.body._id;
    return done();
  });
};


exports.cars03_should_delete_car = function(done){
  supertest(app)
      .delete('/api/cars/' + carOneId)
      .expect(200)
      .end(function(err, response){
          assert.ok(response.statusCode == 200);
        return done();
      });
};

exports.drivers03_should_delete_driver = function(done){
  supertest(app)
      .delete('/api/drivers/' + driverOneId)
      .expect(200)
      .end(function(err, response){
          assert.ok(response.statusCode == 200);
        return done();
      });
};

exports.passengers03_should_delete_passenger = function(done){
  supertest(app)
      .delete('/api/passengers/' + pasesngerOneId)
      .expect(200)
      .end(function(err, response){
          assert.ok(response.statusCode == 200);
        return done();
      });
};

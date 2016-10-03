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

exports.cars01_should_create_car = function(done){
  supertest(app)
  .post('/api/cars')
  .send(carOne)
  .expect(201)
  .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
      assert.ok(typeof response.body === 'object');
      assert.ok(response.body.make === "Ford");
      carOneId = response.body._id;
    return done();
  });
};

exports.cars02_should_get_car = function(done){
  supertest(app)
      .get('/api/cars/' + carOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
          assert.ok(response.statusCode == 200);
        assert.ok(typeof response.body === 'object');
        return done();
      });
};


exports.cars03_should_delete_car = function(done){
  supertest(app)
      .delete('/api/cars/' + carOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
//        assert.ok(typeof response.body === 'object');
          assert.ok(response.statusCode == 200);
        return done();
      });
};

exports.cars04_should_not_get_deleted_car = function(done){
    supertest(app)
        .get('/api/cars/' + carOneId)
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
            assert.ok(response.statusCode == 404);
//            assert.ok(typeof response.body === 'object');
            return done();
        });
};

exports.cars05_should_not_get_random_id_car = function(done){
    supertest(app)
        .get('/api/cars/7383883373838')
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
//            assert.ok(typeof response.body === 'object');
            assert.ok(response.statusCode == 404);
            return done();
        });
};


exports.cars06_should_not_create_car_missing_make = function(done){
    delete carOne.make;
    supertest(app)
        .post('/api/cars')
        .send(carOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};

exports.cars07_should_not_create_car_with_long_make = function(done){
    carOne.make = "1234567890123456789";
    supertest(app)
        .post('/api/cars')
        .send(carOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};


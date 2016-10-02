var supertest = require('supertest'),
assert = require('assert'),
app = require('../server.js');

driverData1 = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-98989@example.com",
  password: "anypwd",
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

exports.driver_should_create_driver = function(done){
  supertest(app)
  .post('/api/drivers')
  .send(driverData1)
  .expect(201)
  .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
    assert.ok(typeof response.body === 'object');
    driverOneId = response.body._id;
    return done();
  });
};

exports.driver_should_get_driver = function(done){
  supertest(app)
      .get('/api/drivers/' + driverOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
        assert.ok(typeof response.body === 'object');
        return done();
      });
};

exports.driver_should_delete_driver = function(done){
  supertest(app)
      .delete('/api/drivers/' + driverOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
//        assert.ok(typeof response.body === 'object');
        return done();
      });
};

exports.driver_should_not_get_driver = function(done){
    supertest(app)
        .get('/api/drivers/' + driverOneId)
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
//            assert.ok(typeof response.body === 'object');
            return done();
        });
};


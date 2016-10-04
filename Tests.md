#Current Tests

Tests marked with * are not yet implemented but will be done in the next few days.

##Drivers

1. `POST /drivers` with a complete and valid driver object should return `201` and the driver object with the `_id` filled in
2. `GET /drivers/:driverId` with the above `_id` in the URL should return `200` and the just created driver
3. `DELETE /drivers/:deiverId` with the above `_id` in the URL should return `200` with the driver deleted
4. `GET /drivers/:driverId` with the above `_id` in the URL should return `404`
5. `GET /drivers/7383883373838` should return `404` as `7383883373838` is not a valid ObjectId
6. `POST /drivers` with the same driver info as Test 1 but missing `emailAddress` should return `400`
7. `POST /drivers` with the same driver info as Test 1 but with a 16 character `firstname` should return `400`
8. `POST /drivers` with the same driver info as Test 1 but missing `password` should return `400`*
9. `POST /drivers` with the same driver info as Test 1 but missing `phoneNumber` should return `400`*
10. `POST /drivers` with the same driver info as Test 1 but missing `drivingLicense` should return `400`*
11. `POST /drivers` with the same driver info as Test 1 but missing `licensedState` should return `400`*
12. `POST /drivers` with the same driver info as Test 1 but malformed `phoneNumber` should return `400`*
13. `POST /drivers` with the same driver info as Test 1 but malformed `emailAddress` should return `400`*

##Passengers

1. `POST /passengers` with a complete and valid passenger object should return `201` and the passenger object with the `_id` filled in
2. `GET /passengers/:passengerId` with the above `_id` in the URL should return `200` and the just created passenger
3. `DELETE /passengers/:passengerId` with the above `_id` in the URL should return `200` with the passenger deleted
4. `GET /passengers/:passengerId` with the above `_id` in the URL should return `404`
5. `GET /passengers/7383883373838` should return `404` as `7383883373838` is not a valid ObjectId
6. `POST /passengers` with the same passenger info as Test 1 but missing `emailAddress` should return `400`
7. `POST /passengers` with the same passenger info as Test 1 but with a 16 character `firstname` should return `400`
8. `POST /passengers` with the same passenger info as Test 1 but missing `password` should return `400`*
9. `POST /passengers` with the same passenger info as Test 1 but missing `phoneNumber` should return `400`*
10. `POST /drivers` with the same passenger info as Test 1 but malformed `phoneNumber` should return `400`*
11. `POST /drivers` with the same passenger info as Test 1 but malformed `emailAddress` should return `400`*


##Cars

#### Without Relationship with Driver

These tests are for cars created independent of the driver. This is the minimum required for this homework. 
But if you pass the tests in the next section, you won't need to pass these tests.

1. `POST /cars` with a complete and valid car object should return `201` and the car object with the `_id` filled in
2. `GET /cars/:carId` with the above `_id` in the URL should return `200` and the just created car
3. `DELETE /cars/:carId` with the above `_id` in the URL should return `200` with the car deleted
4. `GET /cars/:carId` with the above `_id` in the URL should return `404`
5. `GET /cars/7383883373838` should return `404` as `7383883373838` is not a valid ObjectId
6. `POST /cars` with the same car info as Test 1 but missing `make` should return `400`
7. `POST /cars` with the same car info as Test 1 but with a 19 character `make` should return `400`


#### With relationship with driver

The following tests are for cars created with reference to driver. 
These are not required for the current homework but are needed for the next homework. If you pass these tests now, you won't need to pass the above tests.


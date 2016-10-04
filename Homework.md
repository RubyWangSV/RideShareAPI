**Homework due October 02 10AM, 2016**

----

**Part 1**

In this part of the exercise, you will identify error codes and error messages that will be part of the response body of your API if there's a problem
in fulfilling a request. the response body will look as below

```
{
    "statusCode" : 201,
    "errorCode" : 1234,
    "errorMessage" : "Invalid resource name cars"
}

```

Identify all possible error codes for each of the resources and consolidate them into a single table as below. Some 
examples of possible errors are below.

1. Invalid resource name
2. Identifier not matching any resource instance
3. Invalid property name (given in POST)
4. Invalid value for a property (given in POST)

Present your submission in the form a document with the following table. 

Error Code  | Error Message    | Relevant Resources  | Parameters
----------- | ----------|------------ |-----
 1001  | Invalid resource name {0} given  | All Resources  | `0 - Resource Name`
1002 | Given car does not exist | `cars` | None

----

**Part 2**

In the second part of the homework, you will implement all the errors listed in the above table into your code.  
[This link](https://bitbucket.org/appcmusv/transportation-express-api) points to the code you can use to add your code.
Follow instructions in the README.md file to install this locally and add your code using your favorite editor.

Below are the fields you should add to the entities. 

_drivers_

- firstName (String, 1-15)
- lastName (String, 1-15)
- emailAddress (Reegex `/[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/` , Required) 
- password (Used for POST only, String, 8-16, Required - No constraints, Store clear text) 
- addressLine1 (String, 50)
- addressLine2 (String, 50)
- city (String, 50)
- state (String, 2)
- zip (String, 5)
- phoneNumber (String, Regex XXX-XXX-XXXX, Required)
- drivingLicense (String, 8-16, Required)
- licensedState (String, 2, Required)

_passengers_

- firstName (String, 1-15)
- lastName (String, 1-15)
- emailAddress (Reegex `/[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/` , Required) 
- password (Used for POST only, String, 8-16, Required - No constraints, Store clear text) 
- addressLine1 (String, 50)
- addressLine2 (String, 50)
- city (String, 50)
- state (String, 2)
- zip (String, 5)
- phoneNumber (String, Regex XXX-XXX-XXXX, Required)

_cars_

- driver (reference, Required)
- make (String, 18, Required)
- model (Sring, 18, Required)
- license (String, 10, Required)
- doorCount (Number 1-8, Required)

_ride_

- passenger (reference, Required)
- driver (reference, Required)
- car (reference, Required)
- rideType (String, [ECONOMY, PREMIUM, EXECUTIVE], Required)
- startPoint  Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
- endPoint Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
- requestTime (Number, TimeStamp, Required)
- pickupTime (Number, TimeStamp, Required)
- dropOffTime (Number, TimeStamp, Required)
- status (String, [REQUESTED, AWAITING_DRIVER, DRIVE_ASSIGNED, IN_PROGRESS, ARRIVED, CLOSED], Required)
- fare (Number)
- route (series of latitude/longitude values)

_paymentAccount_

- accountType (String, 18, Required)
- accountNumber (Number, 18, Required)
- expirationDate (Number, Timestamp, Required for passenger accounts only)
- nameOnAccount (String, 18, Required)
- bank (String, 18, Required for driver accounts only)

**Homework due October 06 10AM, 2016**

How to add population actions: http://mongoosejs.com/docs/populate.html using References (Not required)

Ride and Tests (We will provide the test on Sunday 02).

Your code should comply with the tests provided.

Add the Ride actions

_Rides routes_
- /rides/:id/routePoints (POST)
- /rides/:id/routePoints (GET)
- /rides/:id/routePoint/current (GET)
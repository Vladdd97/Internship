## Steps to Setup

1. Clone the application

        git@github.com/isd-soft/car-sharing-service.git

2. Create Mysql database

        create database if not exists coordinates_app

3. Change mysql username and password as per your installation

    - open src/main/resources/application.properties

    - change spring.datasource.username and spring.datasource.password as per your mysql installation

4. Run the app from the EasyCoordinateApplication.java class.   


##  Explore our REST API

The app defines following CRUD APIs.
First of all, an account will be needed. To register one, please use:
       
        POST /users/sign-up
        
The request JSON will look like:

        {
                "username" : "example username",
                "username" : "example password"
        }

To receive an authentication token (JWT), use the following path with valid credentials that were used above during registration process:

        POST /login
        
The request JSON will look like:

        {
                "username" : "example username",
                "username" : "example password"
        }

For further usage, the user will need to be authentificated. He will get an Authentification token in the response headers, that will be used for future requests. Also an UserID costum will be received, that will be used in future requests path.

 - in order to get all the coordinates available for an user, use:

        GET users/{userId}/coordinates
        
 - in order to get a coordinate by id available for an user, use:
        
        GET users/{userId}/coordinates/{coordId}
        
 - in order to post a coordinate use:
        
        POST users/{userId}/coordinates
       
 - in order modify a coordinate by id available for an user, use:      
        
        PUT users/{userId}/coordinates/{coordId}
        
 - in order to delete a coordinate by id available for an user, use:       
        
        DELETE users/{userId}/coordinates/{coordId}
        
__Requirements to POST__

The following headers must be present:

        Content-Type: application/json
        
        Authorization: _$token_
        
The data format will look like:

        {
                "addressStart" : "any example street",
                "coordinateStart" : "any coordinate",
                "addressEnd" : "any example street",
                "coordinateEnd" : "any coordinate",
                "startTime" : "an example time representation",
                "endTime" : "an example time representation",
                "lifeTime" : "an example time representation",
                "routeDistance" : "an example distance representation"
        }
       

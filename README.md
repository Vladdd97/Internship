## Steps to Setup

1. Clone the application

        git@github.com:Vladdd97/Internship.git

2. Create Mysql database

        create database if not exists coordinates_app

3. Change mysql username and password as per your installation

    - open src/main/resources/application.properties

    - change spring.datasource.username and spring.datasource.password as per your mysql installation

4. Run the app from the EasyCoordinateApplication.java class.   


##  Explore our REST API

The app defines following CRUD APIs.

        GET /coordinates
        
        POST /coordinates
        
        GET /coordinates/{coordId}
        
        PUT /coordinates/{coordId}
        
        DELETE /coordinates/{coordId}


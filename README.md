## Node / Express / MongoDB / JWT 

1. Project setup
2. Create Express server
3. Postman / Thunder Client setup
4. Express Router setup
5. Error handling with "async Handler"
6. Middleware setup
7. MongoDB setup (cloud)
8. Implement Mongoose Schema to communicate with the DB
9. CRUD API
10. User Authentication with registration and login endpoints
11. Implement Controller functions for different DB operations
12. Password hashing
13. JWT for authentication 
14. Handle relationship for different models/documents in MongoDB with Mongoose
15. Protected routes - only authenticated users can access them
16. User Authorization - only authorized users can access certain endpoints
17. Api Testing

---

Developing a contact app with the help of NodeJS, Express and MongoDB. 
It contains a restful api in order to manage the contact.
Im also implementing the authenitcation and authorization concept using JWT.

Endpoints (based on REST Api conventions):
GET        /api/contacts
GET        /api/contacts/:id
POST      /api/contacts
PUT        /api/contacts/:id
DELETE  /api/contacts/:id

- install node js on your machine
- mkdir <project folder>
- open in vscode
- npm init -y
- create: .env  .gitignore  and server.js
- npm install dotenv express
- make sure that e.g. the PORT is correctly imported from .env
- besides that create a basic express server
- if you want you can install nodemon (for automatic server restart after code changes)
..i prefer to install it globally but you can add it as a dev dependency as well
- install "thunder client" extension in vscode as a http client (or choose postman,..)
- make an endpoint and test thunder client, after starting the server with
- npm run start or npm run dev (depending on if you are using nodemon)

- keep server.js "clean" and create a new folder for the contactRoutes
- create Controllers for the req res logic and connection to the database -> contactController

- accept the body from the request (name, email,phone)
-> to accept data from the client you will need a body parser as middleware
- also i add a custom middleware that transforms the response into json so that the errors also appear in json format

- since using mongodb / mongoose you have to know that with every interaction you would get a promise. Therefore all the controller functions have to be marked as async in order to resolve the promises.
- but: since they are async now i would have to change to a try catch block to catch potential errors / to handle the exceptions inside each of the functions 
- therefore i use another handy middleware: "express-async-handler"
- import it and simply wrap the controller functions with that asyncHandler (that catches all errors and pass them to the errorHandler) 


## MongoDB
- go to: https://www.mongodb.com
- sign in with google/github/email/pw,...
- create a cluster/database
- use the convenient VSCODE Plugin for MongoDB (Overview->Connect->VSCode etc)
- or if you prefer "MongoDB Compass" (which is similar to the client in VSCode or Phpmyadmin, Adminer, etc) use the same connection string
- install mongodb driver
npm install mongodb
- and paste the connection string in the .env
note: you can add the database name before the "?":
mongodb+srv://<username>:<password>@<project name>.b9wzfjg.mongodb.net/<db name>?retryWrites=true&w=majority
-create a folder "config" and dbConnection.js inside and install mongose

- create folder "models" and implement Schema for the contact (models)
- create a userController
- import bcrypt library for hashing the password
> npm i bcrypt
-> after registered the user and saved his inputs into the DB with a hashed password
..you can start with the login functionality and the jwt authentication
-> next install jwt
> npm i jsonwebtoken

- when the users inputs are correct and he authenticates correctly with email & password, the access token (for which i will use jwt) will be returned to the user 
- jwt has a sign method which will take the (a) payload, where you can pass the information you want inside the token, in my case: username and email
- as a 2nd parameter jwt.sign() takes a secret (a unique string) which you put into .env
- and lastly the expiration date of that token (eg: { expiresIn: "1m" } )

- next: protect eg the /current route so that only authenticated users can access this route
- for validating the token i write a middleware "validateToken.js"
- ..which contains the counterpart to the jwt.sign() method: jwt.verify (which takes the token that might be  in die Authorization Header as Bearer Token, the secret from the .env and a callback for the error and success case)
- to make it a middleware that runs before the controller function "currentUser", you just put it in front of that in the userRoutes, so that the middleware only applies to this specific route
- after successful validation i finally attach the user to the request object and call next() in order to call the next middleware

- relation between users and contacts by adding a "user_id" to the contacts documents/models schema
- making the contact routes private
- if you then go to contactRoutes you can put this middleware in front of all the contact routes this time to protect those all at once

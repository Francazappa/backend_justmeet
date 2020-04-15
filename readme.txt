           _                             _     _       
          | |                           (_)   | |      
  ___  ___| |_ _   _ _ __     __ _ _   _ _  __| | ___  
 / __|/ _ \ __| | | | '_ \   / _` | | | | |/ _` |/ _ \ 
 \__ \  __/ |_| |_| | |_) | | (_| | |_| | | (_| |  __/ 
 |___/\___|\__|\__,_| .__/   \__, |\__,_|_|\__,_|\___| 
                    | |       __/ |                    
                    |_|      |___/                     


1) download and install nodejs on your pc:
   -> https://nodejs.org/it/

2) open the terminal in the project's main folder (aka this one) and type the following command:
   -> npm install

   this will install all the needed dependencies specified in the package.json file

3) in the same directory, type in the terminal one of the 3 following commands:
   -> npm start [preferred]
   -> nodemon app.js
   -> node app.js

4) once running you can perform the following api calls:

   -> return all registered users: 			   GET  http://localhost:8080/api/users
   -> return a specific registered user 		   GET  http://localhost:8080/api/users/:userID
   -> register a new user: 				   POST http://localhost:8080/api/users/register { "nickname": "dummyNickname", "email": "dummy@email.com", "password": "dummyPassword" }
   -> login with a registered user      		   POST http://localhost:8080/api/users/login { "email": "dummy@email.com", "password": "dummyPassword" }
   -> create a new post:                		   POST http://localhost:8080/api/posts { "activity": "dummyActivity", "title": "dummyTitle", "details": "dummyDetails", "place": "dummyPlace", "maxPartecipants": dummyValue, "dateOfEvent": dummyDate }
   -> return all posts made by users:   		   GET  http://localhost:8080/api/posts
   -> return a specific post:           		   GET  http://localhost:8080/api/posts/:postID
   -> rate a registered user:				   POST http://localhost:8080/api/users/:userID/rating { "rating": dummyValue }
   -> get a specific user's rating:     		   GET  http://localhost:8080/api/users/:userID/rating
   
   
5) data types and sizes for forms input:
	
	-> login/register:

	nickname: string, min: 4, max: 24 characters
	email:    string, min: 4, max: 128 characters
	password: string, min: 4, max: 128 characters
	
	
	-> posts:
	
	activity: string, min: 4, max: 128 characters
	title:    string, min: 4, max: 64 characters
	details:  string, min: 4, max: 2048 characters (only field that can be omitted)
	place:	  string, min: 4, max: 64 characters
	maxPartecipants: integer, min: 1, max 64
	dateOfEvent: date, min: "now", max: not defined    (formato: mese-giorno-anno -> ex: "02/21/2020")
	
	-> rating:
	
	rating: integer, min: 0, max: 10
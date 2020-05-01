            _                                 _                                          
           | |                               | |                                         
   ___  ___| |_ _   _ _ __     __ _ _ __   __| |                                         
  / __|/ _ \ __| | | | '_ \   / _` | '_ \ / _` |                                         
  \__ \  __/ |_| |_| | |_) | | (_| | | | | (_| |                                         
  |___/\___|\__|\__,_| .__/   \__,_|_| |_|\__,_|                                         
                     | |                                                                 
              _      | |                                      _        _   _             
             (_)     | |                                     | |      | | (_)            
   __ _ _ __  _    __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_ __ _| |_ _  ___  _ __  
  / _` | '_ \| |  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __/ _` | __| |/ _ \| '_ \ 
 | (_| | |_) | | | (_| | (_) | (__| |_| | | | | | |  __/ | | | || (_| | |_| | (_) | | | |
  \__,_| .__/|_|  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__\__,_|\__|_|\___/|_| |_|
       | |                                                                               
       |_|                                                                               
	   

1) download and install nodejs on your pc:
   -> https://nodejs.org/it/

2) open the terminal in the project's main folder (aka this one) and type the following command:
   -> npm install

   this will install all the needed dependencies specified in the package.json file

3) in the same directory, type in the terminal one of the 3 following commands:
   -> npm start [preferred]
   -> nodemon index.js
   -> node index.js

4) once the server is running you can perform the following api calls:

USER API ============================================================================================================================================

   -> return all registered users:                      GET     http://localhost:8080/api/users

   -> return the current user profile:                  GET     http://localhost:8080/api/users/profile

   -> return a specific registered user:                GET     http://localhost:8080/api/users/:userID

   -> register a new user:                              POST    http://localhost:8080/api/users/register { "username": "dummyUsername", "email": "dummy@email.com", "password": "dummyPassword" }

   -> login with a registered user:                     POST    http://localhost:8080/api/users/login { "username": "dummyUsername", "password": "dummyPassword" }

   -> delete a specific user:                  (admin)  DELETE  http://localhost:8080/api/users/:userID   *1

   -> drop 'users' collection on db:           (admin)  DELETE  http://localhost:8080/api/users

=====================================================================================================================================================


POST API ============================================================================================================================================

   -> return all posts made by users:                   GET     http://localhost:8080/api/posts

   -> return a specific post:                           GET     http://localhost:8080/api/posts/:postID

   -> create a new post:                                POST    http://localhost:8080/api/posts { "activity": "dummyActivity", "title": "dummyTitle", "details": "dummyDetails", "place": "dummyPlace", "maxPartecipants": dummyValue, "dateOfEvent": "dummyDateOfEvent","timeOfEvent": "dummyTimeOfEvent" }

   -> join a specific post:                             PATCH   http://localhost:8080/api/posts/:postID/join

   -> leave a specific post:                            PATCH   http://localhost:8080/api/posts/:postID/leave

   -> delete a specific post:                           DELETE  http://localhost:8080/api/posts/:postID

   -> drop 'posts' collection on db:           (admin)  DELETE  http://localhost:8080/api/posts

=======================================================================================================================================================


RATING API ============================================================================================================================================

   -> get a specific user's rating:                     GET     http://localhost:8080/api/rating/:userID 

   -> rate a specific user:                             POST    http://localhost:8080/api/rating/:userID { "rating": dummyVote }

=======================================================================================================================================================


DELETED API ===========================================================================================================================================

   -> get all deleted posts:                   (admin)  GET     http://localhost:8080/api/deleted

   -> get a specific deleted post:             (admin)  GET     http://localhost:8080/api/deleted/:delPostID

   -> delete definitively a deleted post:      (admin)  DELETE  http://localhost:8080/api/deleted/:delPostID

   -> drop 'deletedposts' collection on db:    (admin)  DELETE  http://localhost:8080/api/deleted

=======================================================================================================================================================

5) data types and sizes for forms input:

	-> login/register:

	username: string, min: 3, max: 24 characters
	email:    string, min: 4, max: 128 characters
	password: string, min: 4, max: 128 characters


	-> posts:

	activity: string, min: 4, max: 128 characters
	title:    string, min: 4, max: 64 characters
	details:  string, min: 4, max: 2048 characters (only field that can be omitted)
	place:	 string, min: 4, max: 64 characters
	maxPartecipants: integer, min: 1, max 64
	dateOfEvent: string, min: "now", max: not defined (format: "day-month-year" -> ex: "17-04-2021")   *2
	timeOfEvent: string, max: not defined (format: "hours:minutes" -> ex: "18:50")                     *3


	-> rating:

	rating: integer, min: 0, max: 10




Notes:

   *1: (admin) means the call requires admin privileges to be performed.


   *2: The systems looks for a string formatted in an European way ("20-04-2020") but the frontend sends
       a string formatted this way -> "2020-04-20T04:20:40.375+02:00". 
       So the server runs the dateTrimmer(reqDate) function to trim and reassemble the date in the correct way.

      ->   dateTrimmer("2020-04-20T04:20:40.375+02:00") outputs "20-04-2020"
   

   *3: Since date and time are treated as two different entities we need a similar function to trim the time
       from another input string formatted in the same way -> "2020-04-18T19:30:40.375+02:00".
       So the server runs the timeTrimmer(reqTime) function to trim and reassemble the time in the correct way.

      ->   timeTrimmer("2020-04-20T04:20:40.375+02:00") outputs "04:20"
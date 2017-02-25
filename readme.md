# Eagle Reserve
Eagle Reserve is a responsive, full stack web application that is designed to improve Apple Valley High School’s current system by which teachers make reservations to use computer carts, labs, study spaces, and other equipment. The application will display reservations in a user-friendly, clear manner while eliminating the ability for teachers to overwrite reservations. The application will also allow the admins to oversee the reservation process rather than spending large amounts of time managing reservation issues.

## Installation
To run Eagle Reserve locally:

* Ensure that [Node.js](https://nodejs.org/en/) is installed
* Ensure that [MongoDB](https://www.mongodb.com/) is installed
* `npm install` dependencies
* Eagle Reserve requires a MongoDB DBMS, and a database URL at environmental variable `DATABASE_URL`. Eagle Reserve was developed using [MongoDB](https://www.mongodb.com/) and [Mongoose](http://mongoosejs.com/).
* Register your application at the [Google Developers Console](https://console.developers.google.com).
  * Make sure your application has permissions for the Google Plus API
  * Create and save API credentials and the client secret, to be used as environmental variables referenced below.
* In order to generate and send emails from within the app, the following environmental variables are required:
  * `GOOGLE_AUTH_CLIENT_ID`
  * `GOOGLE_AUTH_CLIENT_SECRET`
  * `GOOGLE_AUTH_CALLBACK_URL`
  * `DM_SESSION_SECRET`
  * `ER_MYEMAIL` (email from which confirmation emails will be sent)
  * `ER_MYPASSWORD` (password for the email account above)
* To give permissions to the first admin user, manually edit the object within MongoDB via terminal by running the following commands:
  * `mongo`
  * `use eagleReserveDatabase`
  * `db.users.find().pretty()`, Note the ObjectId of the user to be given admin permissions
  * Modify, then run, the following command with the correct Id from the step above `db.users.update({'_id':ObjectId("XXX-AdminIdHere-XXX")},{$set:{'admin':true}})`


  ## Demo

<p align="center">
  <img src="public/images/demo.gif?raw=true" alt="ERD"/>
</p>

  ## Technologies Used:
  * Node.js
  * Express.js
  * AngularJS
  * MongoDB
  * Mongoose
  * Passport
  * Google OAuth
  * Nodemailer
  * Bootstrap
  * SASS
  * CSS3
  * HTML5
  * PDFKit
  * ngAnimate
  * UI Bootstrap

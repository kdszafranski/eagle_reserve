# Eagle Reserve
Eagle Reserve is a responsive, full stack web application that is designed to improve Apple Valley High School’s current system by which teachers make reservations to use computer carts, labs, study spaces, and other equipment. The application will display reservations in a user-friendly, clear manner while eliminating the ability for teachers to overwrite reservations. The application will also allow the admins to oversee the reservation process rather than spending large amounts of time managing reservation issues.

## Installation
To run Eagle Reserve locally:

* Ensure that [Node.js](https://nodejs.org/en/) is installed
* `npm install` dependencies
* Eagle Reserve requires a MongoDB DBMS, and a database URL at `DATABASE_URL`. Eagle Reserve was developed using [MongoDB](https://www.mongodb.com/) and [Mongoose](http://mongoosejs.com/).
* In order to generate and send emails from within the app, the follow environmental variables are required:
  * `GOOGLE_AUTH_CLIENT_ID`
  * `GOOGLE_AUTH_CLIENT_SECRET`
  * `GOOGLE_AUTH_CALLBACK_URL`
  * `DM_SESSION_SECRET`
  * `ER_MYEMAIL` (email from which comfirmation emails will be sent)
  * `ER_MYPASSWORD` (password for the email above)

  ## Demos

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

var express = require('express');
var router = express.Router();
var Reservation = require('../../models/reservation');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var moment = require('moment');

// SEND confirmation email
router.post('/', function( req, res ){

  /*TODO: Attach email to req.body if it exits.
          If the email field exists on the object, send it there.
          Otherwise, send it to the req.user.email address */

    console.log( 'in email post' );
    console.log('req.body ->', req.body );
    console.log( "email receiver-->", req.user.email );
    console.log( "item-->", req.body.itemIn );
    console.log( "date-->", req.body.dateIn );
    console.log( "period -->", req.body.periodIn );

    var item = req.body.itemIn;
    var date = moment(req.body.dateIn).format('MMMM Do YYYY');

    var period = req.body.periodIn;

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ER_MYEMAIL,
            pass: process.env.ER_MYPASSWORD
        }
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"Test1" <avhs.test1@apps.district196.org>', // sender address
        to: '<'+req.user.email+'>', // list of receivers
        subject: 'Reservation Confirmation', // Subject line
        text: 'You reserved ' + item + ' on ' + date + ' during period(s): ' + period  // plain text body
        // html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

});

module.exports = router;

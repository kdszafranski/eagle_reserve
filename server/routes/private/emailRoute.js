var express = require('express');
var router = express.Router();
var Reservation = require('../../models/reservation');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

router.post('/', function( req,res){

console.log( 'in email post' );
// send confirmation email on click
// create reusable transporter object using the default SMTP transport
var userName = process.env.ER_MYEMAIL;
var password = process.env.ER_MYPASSWORD;

console.log('USERNAME->', userName);
console.log('PASSWORD->', password);

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
    to: 'avhs.test1@apps.district196.org', // list of receivers
    subject: 'Reservation Confirmation', // Subject line
    text: 'You reserved item on day during period' // plain text body
    // html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

//     var startTime = new Date(Date.now() + 1); //1800000
//     var endTime = new Date(startTime.getTime() + 1000);
//     var j = schedule.scheduleJob({
//       start: startTime,
//       end: endTime,
//       rule: '*/1 * * * * *'
//     }, function() {
//       transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Message sent: ' + info.response);
//         }
//       });
//     });
//     //j.cancel();
//     res.json({
//       status: "Your message will be sent in 30 minutes"
//     });
//   } else {
//     res.json({
//       status: true,
//     });
//   }
// }
// });

});

module.exports = router;

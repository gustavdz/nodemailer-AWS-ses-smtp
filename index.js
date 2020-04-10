var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var sesTransport = require('nodemailer-ses-transport');
var dotenv = require('dotenv').config();

app.post("/send-email", (req, res) => {

  var mailOptions = {
    from: process.env.FROM,
    to: process.env.TO,
    text: 'This is some text',
    html: '<p>This is some HTML</p>',
    subject: 'Nodemailer SMTP Subject',
    list: {
        unsubscribe: {
            url: 'http://urlparacancelarsuscripcion.com'
        }
    }
  };

  // Send e-mail using AWS SES
  // mailOptions.subject = 'Nodemailer SES transporter';
  // var sesTransporter = nodemailer.createTransport(sesTransport({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION
  // }));
  // sesTransporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Message sent: ' + info.response);
  //   }
  // });

  // Send e-mail using SMTP
  var smtpTransporter = nodemailer.createTransport({
    port: 465,
    host: process.env.AWS_REGION,
    secure: true,
    auth: {
      user: process.env.AWS_ACCESS_KEY_ID,
      pass: process.env.AWS_SECRET_ACCESS_KEY,
    },
    debug: true
  });
  smtpTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(error.responseCode).send(error.response);
    } else {
      console.log('Message sent: ' + info.response);
      res.status(200).send(info);
    }
  });
});

app.listen(process.env.PORT, () =>{
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});

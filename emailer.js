var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var emailList = require('./config').emailList;

module.exports.sendMail = function(msg) {
  var mailOptions = {
    from : config.from,
    to : emailList,
    bcc : config.bcc,
    subject : 'Quali Active Errors',
    text : msg
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return console.log(err);
    console.log('Message sent: ' + info.response);
  })
};

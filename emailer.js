var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

module.exports.sendMail = function(msg) {
  var mailOptions = {
    from : 'samuel.womack@wwt.com',
    to : 'Joe.Weber@wwt.com, Jon.Henderson@wwt.com',
    bcc : 'samuel.womack@wwt.com',
    subject : 'Quali Active Errors',
    text : msg
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return console.log(err);
    console.log('Message sent: ' + info.response);
  })
};

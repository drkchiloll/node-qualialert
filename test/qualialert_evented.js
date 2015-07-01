var QualiApi = require('./lib/QualiApi'),
    Promise  = require('bluebird'),
    emailer  = require('./emailer'),
    config   = require('./config');

var EventEmitter = require('events').EventEmitter;
var qualiEvent = new EventEmitter();
var sendInitial = true;
var inError = false;

var runFn = function(qualisys) {
  return qualisys.getCurrentReservations().then(function(reservations) {
    return Promise.filter(reservations, function(reservation) {
      var provStats = reservation.$.ProvisioningStatus;
      console.log(provStats);
      if (provStats === 'Not Run') {
        return reservation.$.Name + ' ' + reservation.$.ProvisioningStatus;
      }
    });
  }).then(function(errors) {
    if (errors.length > 0) {
      qualiEvent.emit('quali-error', errors);
      inError = true;
      return errors;
    }
    return errors;
  })
};

var emailInterval = function(clear) {
  var interval;
  if (clear) {
    clearInterval(interval);
  } else {
    setInterval(function() {
      console.log('send email every xx seconds');
    }, 30000);
  }
};

(function() {
  setInterval(function() {
    var quali = new QualiApi();
    quali.login(config.qualiUser, config.qualiPass, 'Global').then(function() {
      return runFn(quali);
    })
    .then(function(errors) {
      if (errors.length === 0 && inError) {
        console.log('Stopping Sending Emails');
        emailInterval(true);
        sendInitial = true;
        inError = false;
      }
      console.log('Interval Completed');
    });
  }, 15000);
  qualiEvent.on('quali-error', function(errors) {
    console.log(errors[0].$.Name);
    if (sendInitial) {
      // Send Email
      console.log('Email Sent');
      emailInterval(false);
      sendInitial = false;
    }
    console.log('An Error Occurred');
  });
})();

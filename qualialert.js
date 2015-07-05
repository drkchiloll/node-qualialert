var QualiApi = require('./lib/QualiApi'),
    Promise  = require('bluebird'),
    emailer  = require('./emailer'),
    config   = require('./config');

var EventEmitter = require('events').EventEmitter;
var qualiEvent = new EventEmitter();
var sendInitial = true;
var inError = false;
var msg;
var emailIntRef;

var checkForErrors = function(qualisys) {
  return qualisys.getCurrentReservations().then(function(reservations) {
    return Promise.reduce(reservations, function(errors, reservation) {
      var provStats = reservation.$.ProvisioningStatus;
      if (provStats === 'Error') {
        errors.push(reservation.$.Name + ' ' + provStats);
      }
      return errors;
    }, [])
  })
  .then(function(errors) {
    if (errors.length > 0) {
      qualiEvent.emit('quali-error', errors);
      inError = true;
      return errors;
    }
    return errors;
  })
  .catch(function(err) {
    return err;
  });
};

var emailInterval = function(clear) {
  if (clear) {
    clearInterval(emailIntRef);
  } else {
    emailIntRef = setInterval(function() {
      emailer.sendMail(msg);
    }, 3600000);
  }
};

(function() {
  setInterval(function() {
    var quali = new QualiApi();
    quali.login(config.qualiUser, config.qualiPass, 'Global').then(function() {
      return checkForErrors(quali);
    })
    .then(function(errors) {
      if (errors.length === 0 && inError) {
        //We're No Longer In ERROR
        console.log('Stop Sending Emails');
        //Clear the Email Interval
        emailInterval(true);
        //Reset Send Initial For Next Time
        sendInitial = true;
        //Take Us Out of Error Programmatically
        inError = false;
      }
      console.log('Interval Completed');
    })
    .catch(function(err) {
      console.log(err);
    })
  }, 120000);
  //Trigger ERROR Event
  qualiEvent.on('quali-error', function(errors) {
    msg = '';
    errors.forEach(function(error) {
      msg += error + '\n';
    })
    if (sendInitial) {
      // Send Email
      emailer.sendMail(msg);
      console.log('Email Sent');
      emailInterval(false);
      sendInitial = false;
    }
    console.log('An Error Occurred');
  });
})();

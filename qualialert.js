var QualiApi = require('./lib/QualiApi'),
    Promise  = require('bluebird'),
    emailer  = require('./emailer'),
    config   = require('./config');

var intTimer = 300000;

var runFn = function(qualisys) {
  return qualisys.getCurrentReservations().then(function(reservations) {
    return Promise.map(reservations, function(reservation) {
      var provStats = reservation.$.ProvisioningStatus;
      if (provStats === 'Error') {
        console.log(provStats);
        return reservation.$.Name + ' ' + reservation.$.ProvisioningStatus;
      }
    });
  });
};

(function() {
  setInterval(function() {
    var quali = new QualiApi();
    quali.login(config.qualiUser, config.qualiPass, 'Global').then(function() {
      return runFn(quali);
    })
    .then(function(reservations) {
      var activeErr = '';
      reservations.forEach(function(reservation) {
        if (reservation) activeErr += reservation + '\n';
      });
      if (activeErr) {
        emailer.sendMail(activeErr);
        intTimer = 3600000;
      } else {
        intTimer = 300000;
      }
      console.log('Interval Completed');
    });
  }, intTimer);
})();

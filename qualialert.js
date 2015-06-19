var QualiApi = require('./lib/QualiApi'),
    Promise  = require('bluebird'),
    emailer  = require('./emailer'),
    config   = require('./config');

var runFn = function(qualisys) {
  return qualisys.getCurrentReservations().then(function(reservations) {
    return Promise.map(reservations, function(reservation) {
      // console.log(reservation);
      var provStats = reservation.$.ProvisioningStatus;
      if (provStats !== 'Ready' && provStats !== 'Not Run') {
        console.log(resStats);
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
      if (activeErr) emailer.sendMail(activeErr);
      console.log('Interval Completed');
    });
  }, 300000);
})();

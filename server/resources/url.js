const Bluebird = require('bluebird');
const request = require('request');

module.exports = function(value) {
  return new Bluebird(function(resolve, reject) {
    request(value, function(err, resp, body) {
      if (err) { return reject(err); }
      else { resolve(body); }
    });
  });
};

const Bluebird = require('bluebird');

module.exports = function(value) {
  return Bluebird.resolve(String(value));
};

const Bluebird = require('bluebird');

module.exports = function(value) {
  return new Bluebird(function(resolve, reject) {
    try {
      resolve(JSON.parse(value));
    }
    catch(ex) {
      reject(ex);
    }
  });
};

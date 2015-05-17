const Bluebird = require('bluebird');
const parsers = require('../../parsers');

module.exports = function processData(state) {
  return new Bluebird(function(resolve, reject) {
    var handler = state.payload.handler;

    if (handler) {
      handler = new Buffer(handler, 'base64').toString('utf-8');
    }
    else {
      handler = 'function(data) { return data; }';
    }

    var fn = new Function('return ' + handler)();
    var parsed = parsers[state.payload.data.parser](state.data);

    // Merge extracted data into the payload.
    state.payload.data = fn(parsed);

    resolve(state);
  });
};

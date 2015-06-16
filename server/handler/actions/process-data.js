const _ = require('lodash');
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

    // Get the extracted response.
    var extracted = fn(parsed);

    // If the handler returns an Array we need to break out the
    if (Array.isArray(extracted)) {
      state.payload._extracted = extracted;
    }
    else {
      _.extend(state.payload, extracted);
    }

    resolve(state);
  });
};

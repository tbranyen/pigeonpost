const Bluebird = require('bluebird');
const queue = require('../../queue');
const email = require('../../email');
const extend = require('lodash.assign');

function createQueue(payload) {
  queue.create('email', payload).priority('normal').save();
}

module.exports = function queueEmail(state) {
  var payloads = [];

  // If the list of email addresses is already provided, iterate over these to
  // schedule emails.
  if (Array.isArray(state.payload.to)) {
    // Iterate over every email address and
    payloads = state.payload.to.map(function(to, i) {
      var item = Array.isArray(state.payload.data) ?
        state.payload.data[i] : state.payload.data;
      var payload = extend(state.payload, item);

      // Override so that each email is scoped to the current sendee.
      payload.to = to;

      return payload;
    });
  }
  else if (Array.isArray(state.payload.data)) {
    payloads = state.payload.data.map(function(item) {
      // Extend item data into the state payload.
      var payload = extend(state.payload, item);
      return payload;
    });
  }

  // Normalize and queue all payloads.
  payloads.map(email.normalizePayload).forEach(createQueue);

  return Bluebird.resolve(state);
};

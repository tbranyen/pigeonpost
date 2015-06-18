const Bluebird = require('bluebird');
const _ = require('lodash');
const queue = require('../../queue');
const email = require('../../email');
const engines = require('../../engines');

function createQueue(payload) {
  queue.create('email', payload)
    .priority('normal')
    .backoff(true)
    .ttl(1000)
    .attempts(3)
    .save();
}

module.exports = function queueEmail(state) {
  var engine = engines[state.payload.template.engine];
  var payloads = [];

  // Working with an Array of payloads.
  if (state.payload._extended) {
    payloads = state.payload._extended.map(function(payload, i) {
      var merged = _.extend({}, state.payload, payload);

      // Set the specific `to` (not all the recipients).
      merged.to = [merged.to[i]];

      return merged;
    });
  }
  // A single payload.
  else {
    payloads.push(state.payload);
  }

  // Render the template and attach the payload body.
  payloads.forEach(function(payload) {
    payload.body = engine.render(state.template, payload);
  });

  // Normalize and queue all payloads.
  payloads.map(email.normalizePayload).forEach(createQueue);

  return Bluebird.resolve(state);
};

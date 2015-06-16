const Bluebird = require('bluebird');
const queue = require('../../queue');
const email = require('../../email');
const engines = require('../../engines');
const _ = require('lodash');

function createQueue(payload) {
  queue.create('email', payload).priority('normal').save();
}

module.exports = function queueEmail(state) {
  var engine = engines[state.payload.template.engine];
  var payloads = [];

  // Working with an Array of payloads.
  if (state.payload._extended) {
    payloads = state.payload._extended.map(function(payload) {
      return _.extend({}, state.payload, payload);
    });
  }
  // A single payload.
  else {
    payloads.push(state.payload);
  }

  // Render the template and attach the payload body.
  payloads.forEach(function(payload) {
    console.log(state.payload);
    payload.body = engine.render(state.template, payload);
  });

  // Normalize and queue all payloads.
  payloads.map(email.normalizePayload).forEach(createQueue);

  return Bluebird.resolve(state);
};

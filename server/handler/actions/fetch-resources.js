const Bluebird = require('bluebird');
const fetchResource = require('./fetch-resource');

/**
 * Fetch and save the template and data resources to the state object.
 *
 * @param state
 * @return state
 */
module.exports = function fetchResources(state) {
  // If the `body` property is already attached, skip this step.
  if (state.payload.body) {
    return Promise.resolve(state);
  }

  var getTemplate = fetchResource(state.payload.template);
  var getData = fetchResource(state.payload.data);

  return Bluebird.all([getTemplate, getData]).then(function(resources) {
    state.template = resources[0];
    state.data = resources[1];

    return state;
  });
};

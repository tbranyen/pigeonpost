const resources = require('../../resources');

/**
 * Using the type as a guide, fetch the specified resource.
 *
 * @param resource
 * @return {String} contents
 */
module.exports = function fetchResource(resource) {
  var resourceType = resources[resource.type];

  if (!resourceType) {
    throw new Error('Invalid resource type: ' + resource.type);
  }

  return resources[resource.type](resource.value);
};

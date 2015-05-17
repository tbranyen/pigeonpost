const mustache = require('mustache');

exports.render = function(template, data) {
  return mustache.render(template, data);
};

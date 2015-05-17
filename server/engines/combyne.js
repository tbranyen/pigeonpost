const combyne = require('combyne');

exports.render = function(template, data) {
  return combyne(template).render(data);
};

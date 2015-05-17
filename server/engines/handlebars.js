const handlebars = require('handlebars');

exports.render = function(template, data) {
  return Handlebars.compile(template)(data);
};

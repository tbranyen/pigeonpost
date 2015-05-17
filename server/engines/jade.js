var jade = require('jade');

exports.render = function(template, data) {
  return jade.render(template, data);
};

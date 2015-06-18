exports.list = [];

exports.load = function(list) {
  exports.list = list;
};

exports.add = function(email) {
  exports.list.push(email);

  // TODO Trigger some kind of event.
};

exports.lookup = function(email) {
  var found = exports.list.indexOf(email) > -1;

  // Return not found to work better with `Array#filter`.
  return !found;
};

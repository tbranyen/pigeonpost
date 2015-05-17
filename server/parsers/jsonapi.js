// this is a naive json-api parser. the emailing service should support a
// variety of "parsers" as dependencies. parsers can be used to do any pre
// processing of data before they hit the context function.
const _ = require('lodash');

function link (included, entry) {
  var links = entry.links;
  if (links) {
    Object.keys(links).forEach(function (relationName) {
      var link = links[relationName].linkage;
      entry[relationName] = included[link.type][link.id];
    });
  }
  return entry;
}

function parse(input) {
  input = JSON.parse(input);

  // key all included by type
  var included = _.reduce(input.included, function (result, entry) {
    var type = result[entry.type];
    if (!type) {
      result[entry.type] = type = {};
    }
    type[entry.id] = entry;
    return result;
  }, {});

  // build a linker from the included records
  var linker = link.bind(null, included);

  // interlink included records
  var embedded = _.reduce(included, function (result, entries, type) {
    result[type] = _.reduce(entries, function (typeResult, entry) {
      typeResult[entry.id] = linker(entry);
      return typeResult;
    }, {});
    return result;
  }, {});

  // return primary data with references to included data
  return input.data.map(linker);
};

module.exports = parse;

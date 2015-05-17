const cheerio = require('cheerio');

module.exports = function(value) {
  return cheerio.load(value);
};

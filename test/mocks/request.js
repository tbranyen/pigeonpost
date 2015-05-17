module.exports = function(url, callback) {
  switch (url) {
    case 'http://tbranyen.com/': {
      setTimeout(function() {
        callback(null, null, '<title>Tim</title>');
      }, 0);
    }
  }
};

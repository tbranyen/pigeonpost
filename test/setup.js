[
  'request',
  'aws-sdk',
  'kue',
  'crontab'
].forEach(function(name) {
  require.cache[require.resolve(name)] = {
    exports: require('./mocks/' + name)
  };
});

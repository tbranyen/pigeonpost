var path = require('path');

// Configure test environment.
process.env.AWS_SES_SECRETS = path.join(__dirname, 'fixtures/secrets.json');

// Install mocks.
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

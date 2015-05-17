const assert = require('assert');
const exec = require('child_process').exec;

describe('Handler', function() {
  it('can be initialized from the command line', function(done) {
    exec('node bin/handler', function(err, output) {
      done();
    });
  });

  it('will error if incorrect arguments are passed', function(done) {
    exec('node bin/handler', function(err, output) {
      assert.equal(err.message, 'Command failed: /bin/sh -c node bin/handler\nInsufficient arguments to handler see --help\n');
      done();
    });
  });
});

const queue = require('../queue');
const send = require('./send');

module.exports = function() {
  // Set a maximum of 20 concurrent jobs to process at a time, since we are
  // only firing off to Amazon, this is unlikely to cause a problem.
  queue.process('email', 20, function(job, done) {
    send(job.data, done);
  });
};

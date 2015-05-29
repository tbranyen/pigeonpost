const Bluebird = require('bluebird');
const getPayload = require('./actions/get-payload');
const fetchResources = require('./actions/fetch-resources');
const processData = require('./actions/process-data');
const renderTemplate = require('./actions/render-template');
const queueEmail = require('./actions/queue-email');
const crontab = require('crontab');

/**
 * Exports a Promise chain that processes all the handler actions.
 *
 * @param argv
 * @return {Promise} chain
 */
module.exports = function(argv) {
  argv = (argv || process.argv).slice(2);

  if (!argv.length) {
    console.error('Insufficient arguments to handler see --help');
    return process.exit(1);
  }

  // Pass state through the Promise chain.
  return Bluebird.resolve({ argv: argv })
    .then(getPayload)
    .then(fetchResources)
    .then(processData)
    .then(renderTemplate)
    .then(queueEmail)
    .then(function(state) {
      if (state.payload.expires) {
        return new Bluebird(function(resolve, reject) {
          crontab.load(function(err, crontab) {
            crontab.remove({ comment: state.payload.id });
            crontab.save(resolve);
          });
        });
      }

      return state;
    });
};

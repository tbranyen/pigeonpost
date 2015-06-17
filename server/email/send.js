const path = require('path');
const AWS = require('aws-sdk');

module.exports = function send(payload, done) {
  AWS.config.loadFromPath(process.env.AWS_SES_SECRETS);

  new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(payload, done);
};

const path = require('path');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

module.exports = function send(payload, done) {
  AWS.config.loadFromPath(process.env.AWS_SES_SECRETS);

  var ses = new AWS.SES({ apiVersion: '2010-12-01' });
  ses.sendEmail(payload.data || payload, done);
};

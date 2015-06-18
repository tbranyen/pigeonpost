const path = require('path');
const AWS = require('aws-sdk');
const bounceList = require('./bounce-list');

module.exports = function send(payload, done) {
  AWS.config.loadFromPath(process.env.AWS_SES_SECRETS);

  var dest = payload.Destination;

  // Look for blocked emails (bounces/complaints).
  dest.ToAddresses = dest.ToAddresses.filter(bounceList.lookup);
  dest.CcAddresses = dest.CcAddresses.filter(bounceList.lookup);
  dest.BccAddresses = dest.BccAddresses.filter(bounceList.lookup);

  // Must have atleast one recipient.
  if (dest.ToAddresses.length) {
    new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(payload, done);
  }
  else {
    done({ message: 'No addresses to send to, are they all blocked?' });
  }
};

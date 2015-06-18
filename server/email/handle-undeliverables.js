const AWS = require('aws-sdk');
const config = require(process.env.AWS_SES_SECRETS);
const bounceList = require('./bounce-list');

AWS.config.loadFromPath(process.env.AWS_SES_SECRETS);

var sqs = new AWS.SQS();

/**
 * Handles Amazon SES failures.
 *
 * @return
 */
function receiveMessage() {
  if (!config.sqsUrl) {
    console.warn('>> Missing SQS Resource URL, cannot monitor SES failures');
  }

  // Receive 1 or many messages from Amazons's queue system.  This is a polling
  // operation.
  sqs.receiveMessage({
    QueueUrl: config.sqsUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20
  }, function (err, data) {
    if (data && data.Messages && data.Messages.length) {
      data.Messages.forEach(function(message) {
        if (!message.Body) { return; }

        var MessageBody = JSON.parse(JSON.parse(message.Body).Message);

        // Is a complain'd email.
        if (MessageBody.notificationType === 'Complaint') {
          MessageBody.complaint.complainedRecipients.forEach(function(recipient) {
            bounceList.add(recipient.emailAddress);
          });
        }
        // Is a Bounce'd email.
        else if (MessageBody.notificationType === 'Bounce') {
          MessageBody.bounce.bouncedRecipients.forEach(function(recipient) {
            bounceList.add(recipient.emailAddress);
          });
        }

        // If we don't remove the message, it will remain in the queue.
        sqs.deleteMessage({
          QueueUrl: config.sqsUrl,
          ReceiptHandle: message.ReceiptHandle
        }, function nop() {});
      });

      // If there were messages and no errors, retry immediately.
      receiveMessage();
    }
    // If there were no messages and no failures, wait 5 seconds before retrying.
    else if (!err) {
      setTimeout(receiveMessage, 5000);
    }
    // If there was a failure, wait a minute before retrying.
    else {
      setTimeout(receiveMessage, 60000);
    }
  });
};

module.exports = receiveMessage;

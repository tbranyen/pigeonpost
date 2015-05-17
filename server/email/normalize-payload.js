/**
 * Normalizes a simplified payload into an object that is suitable for Amazon
 * SES.
 *
 * @param {Object} payload
 * @return {Object}
 */
module.exports = function normalizePayload(payload) {
  return {
    Source: payload.from,
    Destination: {
      BccAddresses: payload.bcc || [],
      CcAddresses: payload.cc || [],
      ToAddresses: payload.to || []
    },
    Message: {
      Body: {
        Html: {
          Data: payload.body
        }
      },
      Subject: {
        Data: payload.subject
      }
    }
  };
};

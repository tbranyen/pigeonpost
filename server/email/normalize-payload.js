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
      ToAddresses: payload.to,
      CcAddresses: payload.cc || [],
      BccAddresses: payload.bcc || []
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

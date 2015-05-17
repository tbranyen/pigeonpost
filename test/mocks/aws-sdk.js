var env = process.env;

exports.env = {
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY
};

exports.config = {};
exports.config.update = function(key, val) {
  exports.env[key] = val;
};
exports.config.loadFromPath = function(path) {
  require(path);
};

exports.SES = function() {};
exports.SES.prototype = {
  sendEmail: function(config, cb) {
    this.config = config;
    this.cb = cb;

    this.cb(null, {
      status: "success",

      data: {
        ResponseMetadata: {
          RequestId: "454fcee7-f293-11e4-8ce7-3f483707c2e3"
        },

        MessageId: "0000014d20639464-dd5a5eb4-5205-48fe-96c3-efc6fd5e883a-000000"
      }
    });
  }
};

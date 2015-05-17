const moment = require('moment');
const exec = require('child_process').exec;
const handler = require('../../server/handler');

module.exports = {
  result: {
    comment: function() {
      return this.comment;
    }
  },

  load: function(callback) {
    var result = this.result;

    callback(null, {
      create: function(command, when, uuid) {
        result._command = command;
        result._when = when;
        result._comment = uuid;

        command = command.split(' ').slice(1).join(' ');
        command = new Array(2).concat(command);

        // Only test if not a special identifier.
        if (when.indexOf('@') === -1) {
          setTimeout(function() {
            handler(command).then(function(state) {
              result._state = state;
            });
          }, -1 * moment().diff(new Date(when)));
        }

        return result;
      },

      find: function(obj) {
        return obj ? this.result : [this.result];
      },

      remove: function(jobs) {},
      save: function(fn) { fn(); }
    });
  }
};
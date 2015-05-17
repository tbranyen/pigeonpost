module.exports = {
  queue: {
    _created: {
      priority: function(priority) {
        this.priority = priority;

        return { save: function() {} };
      }
    },

    process: function(name, concurrency, fn) {
      this.name = name;
      this.concurrency = concurrency;
      this.fn = fn;
    },

    create: function(name, payload) {
      this.name = name;
      this.payload = payload;

      return this._created;
    }
  },

  createQueue: function() {
    return this.queue;
  }
};

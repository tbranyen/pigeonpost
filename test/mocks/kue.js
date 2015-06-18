module.exports = {
  queue: {
    _created: {
      save: function() {},

      priority: function(priority) {
        this.priority = priority;
        return this;
      },

      ttl: function(ttl) {
        this.ttl = ttl;
        return this;
      },

      attempts: function(attempts) {
        this.attempts = attempts;
        return this;
      },

      backoff: function(backoff) {
        this.backoff = backoff;
        return this;
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

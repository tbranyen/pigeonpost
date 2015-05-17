const assert = require('assert');
const email = require('../../server/email');

describe('Email', function() {
  it('exports the public interface', function() {
    assert.ok(email.send);
    assert.ok(email.processQueue);
    assert.ok(email.normalizePayload);
  });
});

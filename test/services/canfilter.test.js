const assert = require('assert');
const app = require('../../src/app');

describe('\'canfilter\' service', () => {
  it('registered the service', () => {
    const service = app.service('canfilter');

    assert.ok(service, 'Registered the service');
  });
});

const assert = require('assert');
const app = require('../../src/app');

describe('\'remotecommand\' service', () => {
  it('registered the service', () => {
    const service = app.service('remotecommand');

    assert.ok(service, 'Registered the service');
  });
});

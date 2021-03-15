const assert = require('assert');
const app = require('../../src/app');

describe('\'command\' service', () => {
  it('registered the service', () => {
    const service = app.service('command');

    assert.ok(service, 'Registered the service');
  });
});

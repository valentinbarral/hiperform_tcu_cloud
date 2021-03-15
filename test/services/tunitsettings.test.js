const assert = require('assert');
const app = require('../../src/app');

describe('\'tunitsettings\' service', () => {
  it('registered the service', () => {
    const service = app.service('tunitsettings');

    assert.ok(service, 'Registered the service');
  });
});

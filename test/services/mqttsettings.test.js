const assert = require('assert');
const app = require('../../src/app');

describe('\'mqttsettings\' service', () => {
  it('registered the service', () => {
    const service = app.service('mqttsettings');

    assert.ok(service, 'Registered the service');
  });
});

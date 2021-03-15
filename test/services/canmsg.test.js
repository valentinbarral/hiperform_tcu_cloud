const assert = require('assert');
const app = require('../../src/app');

describe('\'canmsg\' service', () => {
  it('registered the service', () => {
    const service = app.service('canmsg');

    assert.ok(service, 'Registered the service');
  });
});

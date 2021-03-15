const { authenticate } = require('@feathersjs/authentication').hooks;

const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [(context)=> {

      context.result.data.forEach(function(obj){ delete obj['__v']; });
      return context;
    }],
    get: [(context)=> {
      delete context.result['__v'];
      return context;
    }],
    create: [(context)=> {
      delete context.result['__v'];
      delete context.result['updatedAt'];

      let mqttLocalBroker = context.app.get('mqttLocalBroker');
      //mqttLocalBroker.eraseSettingsCache();
      mqttLocalBroker.newMqttSettings(context.result);

      return context;
    }],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

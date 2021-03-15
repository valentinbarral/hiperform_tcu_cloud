const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow } = require('feathers-hooks-common');
const errors = require('@feathersjs/errors');


const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [disallow('external'),  authenticate('jwt') ],
    get: [disallow('external'), authenticate('jwt') ],
    //create: [disallow('external'),  hashPassword() ],
    create: [hashPassword()],
    update: [ disallow('external'), hashPassword(),  authenticate('jwt') ],
    patch: [ disallow('external'),  authenticate('jwt') ],
    remove: [ disallow('external'), authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [(context) => {

      if(context.error.code===405) {
        context.error = new errors.MethodNotAllowed('Method not allowed');
      }
      delete context.error.className;
      delete context.error.errors; 

      return context;
    }],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

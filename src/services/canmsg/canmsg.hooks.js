const { authenticate } = require('@feathersjs/authentication').hooks;
const async = require('async');
const { disallow } = require('feathers-hooks-common');
const canDecoder = require('../../can_decoder')

module.exports = {
  before: {
    all: [
      authenticate('jwt')],
    find: [(context) => {

      var decoded = context.params.query.decoded;
      var hasDecode = decoded !== undefined;
      if (hasDecode) {
        delete context.params.query['decoded'];
        context.params.extra = { decoded: decoded };
      }

      return context;

    }],
    get: [(context) => {

      var decoded = context.params.query.decoded;
      var hasDecode = decoded !== undefined;
      if (hasDecode) {
        delete context.params.query['decoded'];
        context.params.extra = { decoded: decoded };
      }

      return context;

    }],
    create: [],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [async context => {

      var hasToDecode = false;

      if (context.params.extra !== undefined) {
        if (context.params.extra.decoded !== undefined) {
          hasToDecode = context.params.extra.decoded == 'true';
        }
      }

      if (hasToDecode) {
        return new Promise((resolve, reject) => {
            result = canDecoder.decodeMin(context.result.data, 'dbc/HYP-CAN_v01__and__iEV7S-CCAN.dbc', (result)=>{
              context.result.data = result;
              resolve();
            });

        }).then(() => {
            context.result.decoded = 'true';
            return context;
          }, (reject) => {
            //decoded rejection
          }
          );
      } else {

        context.result.data.forEach(function (obj) {
          delete obj['__v'];
          delete obj['createdAt'];
          delete obj['updatedAt'];
        });
        context.result.decoded = 'false';

        return context;
      }
    }],
    get: [(context) => {
      delete context.result['__v'];
      console.log('GET: ' + JSON.stringify(context.result.data));
      return context;
    }],
    create: [(context) => {
      delete context.result['__v'];
      delete context.result['updatedAt'];
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

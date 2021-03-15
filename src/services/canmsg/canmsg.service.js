// Initializes the `canmsg` service on path `/canmsg`
const createService = require('feathers-mongoose');
const createModel = require('../../models/canmsg.model');
const hooks = require('./canmsg.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');
  app.set('CanmsgModel',Model);
  const options = {
    Model,
    paginate: {
      default: 1,
      max: 1000
    },
    multi: true, 
  };

  // Initialize our service with any options it requires
  app.use('/canmsg', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('canmsg');

  service.hooks(hooks);
};

// Initializes the `mqttsettings` service on path `/mqttsettings`
const createService = require('feathers-mongoose');
const createModel = require('../../models/mqttsettings.model');
const hooks = require('./mqttsettings.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/mqttsettings', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('mqttsettings');

  service.hooks(hooks);
};

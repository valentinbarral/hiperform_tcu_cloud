// Initializes the `tunitsettings` service on path `/tunitsettings`
const { Tunitsettings } = require('./tunitsettings.class');
const createModel = require('../../models/tunitsettings.model');
const hooks = require('./tunitsettings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tunitsettings', new Tunitsettings(options, app));

  const mqttLocalBroker =  app.get('mqttLocalBroker');

  // Get our initialized service so that we can register hooks
  const service = app.service('tunitsettings');

  service.on('created', newSettings => {

      mqttLocalBroker.setTunitSettings(newSettings);

  });


  service.hooks(hooks);
};

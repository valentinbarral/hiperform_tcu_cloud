// Initializes the `remotecommand` service on path `/remotecommand`
const { Command } = require('./command.class');
const hooks = require('./command.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/command', new Command(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('command');

  service.hooks(hooks);
};

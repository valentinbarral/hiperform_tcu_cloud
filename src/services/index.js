const users = require('./users/users.service.js');
const mqttsettings = require('./mqttsettings/mqttsettings.service.js');
const canmsg = require('./canmsg/canmsg.service.js');
const command = require('./command/command.service.js');
const tunitsettings = require('./tunitsettings/tunitsettings.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mqttsettings);
  app.configure(canmsg, {paginate: {
    default: 1,
    max: 3,
    limit:1
  }});
  app.configure(command);
  app.configure(tunitsettings);
};

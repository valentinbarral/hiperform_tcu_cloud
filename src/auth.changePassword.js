
const errors = require('@feathersjs/errors');
const bcrypt = require('bcryptjs');
const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword
} = require('@feathersjs/authentication-local').hooks;

const comparePasswords = (oldPassword, password) => new Promise((resolve, reject) => {
  bcrypt.compare(oldPassword, password, (err, data1) => {
    if(err || !data1) return reject();
    return resolve();
  });
});

module.exports = function(app) {
  // Add authentication/changePassword service
  app.use('/authentication/changePassword', {
    async create(data, params) {
      // const user = await app.service('users').get(params.payload.userId);
      const user = params.user;
      if(!data.password) throw new errors.BadRequest('Missing password');
      if(!data.oldPassword) throw new errors.BadRequest('Missing oldPassword');
      try {
        await comparePasswords(data.oldPassword, user.password);
      }
      catch(e) {
        throw new errors.BadRequest('Current password wrong');
      }
      const newUser = await app.service('users').patch(user._id, {password: data.password});
      delete newUser.password; // never send pwd to client
      return newUser;
    }
  });

  // Add jwt authentication
  app.service('/authentication/changePassword').hooks({
    before: [hashPassword(), authenticate('jwt')],
    after: {
      create: 
        [(context)=> {
      delete context.result['__v'];
      delete context.result['createddAt'];
      return context;
      }]
    }
  });
};
// mqttsettings-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const mqttsettings = new Schema({
    brokerUrl: { type: String, required: true },
    decoded: { type:Boolean, required:true, default: false}
  }, {
    timestamps: true
  });

  return mongooseClient.model('mqttsettings', mqttsettings);
};

// canmsg-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const canmsg = new Schema({
    'can_id': { type: String, required: true },
    'can_dlc': { type: String, required: true },
    'can_data': { type: String, required: true },
    'can_type': { type: String, required: true },
    'can_idB': { type: String, required: false },
    'can_rt': { type: String, required: false },
    'can_timestamp': {type: Number, required: true}
  }, {
    timestamps: true
  });

  return mongooseClient.model('canmsg', canmsg);
};

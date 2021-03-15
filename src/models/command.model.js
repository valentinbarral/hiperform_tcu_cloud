// command-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const command = new Schema({
    command: { type: String, required: true },
    filter: { type: [String], required: false },
    timeout: {type: Number, required:false},
  }, {
    timestamps: true
  });

  return mongooseClient.model('command', command);
};

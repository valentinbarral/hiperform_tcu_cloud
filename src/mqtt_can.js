const MQTTcan = require('./mqtt/mqtt_can.js');

module.exports = function (app) {
	var mqttcan = new MQTTcan('mqtt://127.0.0.1:1883', 'TEST_TOPIC', 2000, app);
	app.set('mqttCan', mqttcan);
};
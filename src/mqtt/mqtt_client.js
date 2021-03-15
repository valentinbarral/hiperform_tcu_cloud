'use strict';

var mqtt = require('mqtt');

exports.sendMsg = function(brokerUrl, topic, data){
	var client  = mqtt.connect(brokerUrl);
	client.on('connect', function () {
		client.publish(topic, data, {}, function(){
			client.end();
		});
	});

	client.on('error', function(error){
		console.log("MQTT client error: " + error);
	});
};



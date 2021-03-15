'use strict';
const mqttClient = require('./mqtt_client.js');

class MQTTcan {

	constructor(brokerUrl, topic, publishInterval, app){
		this.brokerUrl = brokerUrl;
		this.topic = topic;  
		this.publishInterval = publishInterval;
		this.active = false;
		this.filterIds = [];
		this.withTimeout = false;
		this.timeout = 0;
		this.app = app;
	}

	updateApp(app){
		this.app = app;
	}

	updateSettings(brokerUrl, topic, publishInterval){
		this.active = false;
		this.brokerUrl = brokerUrl;
		this.topic = topic;  
		this.publishInterval = publishInterval;
		this.filterIds = [];
		this.withTimeout = false;
		this.timeout = 0;
	}

	start(filter, withTimeout, timeout){
		if (withTimeout===true){
			let timestamp = Date.now();
			this.timeout = timestamp + timeout*1000;
			this.withTimeout = true;
		} else {
			this.withTimeout = false;
		}

		if (filter.length>0) {
			this.filterIds = filter;
		} else {
			this.filterIds = [];
		}
		
		this.active = true;
		this.sendMsg();
	}

	stop(){
		this.active = false;
	}

	generateSubmsg(canMsg){

		let submsg = {};
		submsg['can_type'] = canMsg.type;
		submsg['can_id'] = canMsg.id;
		submsg['can_dlc'] = canMsg.dlc;
		submsg['can_data'] = canMsg.data;

		return submsg;

		//return timestamp+': {can.type:'+canMsg.type+', can.id:' +canMsg.id+ ', can.dlc:' +canMsg.dlc+ ', can.data:'+canMsg.data+'}';
	}

	getDebugCanData(id){
		if (id=='0097'){
			return '7F7D7F7D7D000000';
		} else if (id=='0098'){
			return '0100010000000000';
		} else {
			return '7FADBFDD7D000000';
		}
	}

	generateMsg(){

		const ids = [ '0095','0096','0097','0098','0099'];
		const numSubMsgs= Math.floor((Math.random() * 8) + 1);

		let allowedIds = ids;

		if (this.filterIds.length>0){
			allowedIds = ids.filter((anId)=> {
				return this.filterIds.includes(anId);
			});
		}

		if (allowedIds.length===0){
			return '{}';
		}

		let timestamp = Date.now();

		let msg = {};

		for(let i = 0; i < numSubMsgs; i++){
			const idIndex= Math.floor((Math.random() * allowedIds.length));
			let canMsg = {};
			canMsg.id = allowedIds[idIndex];
			canMsg.type = 'Rx';
			canMsg.dlc = 8;
			canMsg.data = this.getDebugCanData(canMsg.id);
			let submsg = this.generateSubmsg(canMsg);

			msg[timestamp + i*100] = submsg;
		}

		return msg;
	}

	sendMsg(){
		setTimeout(()=>{
			if (this.active===true){
				let msg = this.generateMsg();
				mqttClient.sendMsg(this.brokerUrl,this.topic, JSON.stringify(msg));

				const timestamps = Object.keys(msg);

				for(let i = 0; i < timestamps.length; i++){
					let canmsg = msg[timestamps[i]];
					canmsg['can_timestamp'] = timestamps[i];
					this.app.service('canmsg').create(canmsg);
				}

				if (this.withTimeout===true && Date.now()>=this.timeout){
					this.stop();
				} else {
					this.sendMsg();
				}	
			}
		}, this.publishInterval);
	}
}

module.exports = MQTTcan;
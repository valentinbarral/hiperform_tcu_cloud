'use strict';

const aedes = require('aedes')({
    qos: 0,
    clients: 1000,
    concurrency: 5000
});
const net  = require('net');
const mqttClient = require('./mqtt_client.js');
;
const async = require('async');
const createModel = require('../models/canmsg.model');
const app = require('../app.js');
const logger = require('../logger.js');
const canDecoder = require('../can_decoder');
var logging = require('aedes-logging')

//const logger = require('../logger');

class MQTTLocalBroker {
	constructor( port, app){
        this.port = port;
        this.app = app;
        this.server = net.createServer(aedes.handle);
        this.mqttSettings = [];
        this.hasMqttSettings = false;
        this.mqttSettingsDecoded = [];
        this.hasMqttSettings = false;

        this.stackOfCommands = [];
        this.currentCommand = {};
        this.currentCommand.id = '';
        this.tunitSettings = {};
        this.tunitSettings.imei = '123';
        this.tunitSettings.timeout = 5;
        this.logger = app.get('logger');
        logging({instance:aedes, servers:[this.server]})
	}

	updateApp(app){
		this.app = app;
	}

    processResponse(value){
        let self = this;
        let payload = JSON.parse(value.payload.toString());
        self.logger.debug('Payload: ' + payload);
        self.logger.debug('Current Command Id: ' + this.currentCommand.id);
        if (this.currentCommand.id!==''){
            if (payload.uuid===this.currentCommand.id && payload.result==='OK'){
                self.logger.debug('Response OK');
                    this.proccessStackOfCommands();
            } else {
                self.logger.debug('Response KO-ERROR');
                    this.currentCommand.reject({message:payload.result});
                    this.stackOfCommands = [];
                    this.currentCommand.id = '';
            }   
        }
    }

    setTunitSettings(tunitSettings){
        this.stop();
        this.tunitSettings = tunitSettings;
        this.start();
    }

	start(){
        
        var self = this;
        self.logger.debug('MQTT Local Broker start with settings: ' + JSON.stringify(this.tunitSettings));
        this.server.listen(self.port, function () {
            aedes.subscribe(self.tunitSettings.imei+'/execute_command_response', function(value, cb){
                self.processResponse(value);
            });
            aedes.subscribe(self.tunitSettings.imei +'/read_data_response', function(value, cb){
                self.processResponse(value);
            });
            aedes.subscribe(self.tunitSettings.imei +'/write_settings_response', function(value,cb){
                self.processResponse(value);
            });

            aedes.on('clientError', function (client, err) {
                self.logger.debug(process.pid,' client error ', client.id, err.message);
            });

            // aedes.on('publish', function(value, client){
            //     self.logger.debug('CAN Measurement package received: ' + JSON.stringify(value));
            //     if (value.topic===self.tunitSettings.imei+'/measurements' && client!=null){
            //         self.logger.debug('CAN Measurement package received: ' + value.payload);
            //         let measurements = JSON.parse(value.payload);
            //         let timestamps = Object.keys(measurements);
    
            //         async.map(timestamps, function(aTimestamp, callback){
            //             let aMeasurement = measurements[aTimestamp];
            //             let aCanmsg = {};
            //             aCanmsg.can_id = aMeasurement['can.id'];
            //             aCanmsg.can_dlc = aMeasurement['can.dlc'];
            //             aCanmsg.can_data = aMeasurement['can.data'];
            //             aCanmsg.can_type = aMeasurement['can.type'];
            //             aCanmsg.can_timestamp = Number(aTimestamp);
            //             callback(null, aCanmsg);
            //         }, function(err, results){
    
            //             if (err){
            //                 self.logger.debug('Couldnt save canmsgs: '+ err);
            //             } else {
            //                 self.app.service('canmsg')
            //                 .create(results)
            //                 .then(()=>{  self.logger.debug('CAN Measurement stored ');},
            //                 (rejected)=>{ self.logger.debug('Rejected on CAN Measurement stored: '+ rejected);})
            //                 .catch((error)=>{  self.logger.debug('Cant store CAN Measurement' + error);});
            //             }
            //         });
            //     }
            // });

            aedes.subscribe(self.tunitSettings.imei+'/measurements', function(value, cb){
                //self.logger.debug('CAN Measurement package received: ' + value.payload);
                //We store the measurements in the db
               

                let measurements = JSON.parse(value.payload);

                let timestamps = Object.keys(measurements);
                timestamps.sort(function(a, b) {
                    return Number(a) - Number(b);
                });

                async.map(timestamps, function(aTimestamp, callback){
                    let aMeasurement = measurements[aTimestamp];
                    // let aCanmsg = {};
                    // aCanmsg.can_id = aMeasurement['can.id'];
                    // aCanmsg.can_dlc = aMeasurement['can.dlc'];
                    // aCanmsg.can_data = aMeasurement['can.data'];
                    // aCanmsg.can_type = aMeasurement['can.type'];
                    // aCanmsg.can_timestamp = Number(aTimestamp);

                    

                    let aCanmsg = {
                        measurement: "can_msg",
                        tags: {
                            id: aMeasurement['can.id'],
                            dlc: aMeasurement['can.dlc'],
                            type: aMeasurement['can.type']
                        },
                        fields: {
                            data:aMeasurement['can.data']
                        },
                        timestamp: Number(aTimestamp)*1000
                    };
                    callback(null, aCanmsg);
                }, function(err, results){

                    if (err){
                        self.logger.debug('Couldnt save canmsgs: '+ err);
                    } else {
                        // self.app.get('CanmsgModel').insertMany(results)
                        // .then(()=>{  self.logger.debug('CAN Measurement stored ');},
                        // (rejected)=>{ self.logger.debug('Rejected on CAN Measurement stored: '+ rejected);})
                        // .catch((error)=>{  self.logger.debug('Cant store CAN Measurement' + error);});

                        //INFLUX DB

                        self.app.get('influxdb').writePoints(results).
                        then(() => {
                            self.logger.debug('CAN Measurement stored ');
                        }, 
                        (e) => {self.logger.debug('Cant store CAN Measurement_ ' + e);});
                        
                        //THIS RELAYS THE RAW VALUES
                        self.relayResponseDecoded(self.tunitSettings.imei+'/measurements', results);


                    }
                    // async.parallel([
                    //     function(callbackParallel) {
                    //         if (err){
                    //             self.logger.debug('Couldnt save canmsgs: '+ err);
                    //         } else {
                    //             self.app.get('CanmsgModel').insertMany(results)
                    //             .then(()=>{  self.logger.debug('CAN Measurement stored ');},
                    //             (rejected)=>{ self.logger.debug('Rejected on CAN Measurement stored: '+ rejected);})
                    //             .catch((error)=>{  self.logger.debug('Cant store CAN Measurement' + error);});
                    //         }
                    //         callbackParallel(null);
                    //     },
                    //     function(callbackParallel) {
                    //         let canTypes = {}
                    //         results.forEach(element => {
                    //             if (!(element.can_id in canTypes)){
                    //                 canTypes[element.can_id] = [];
                    //             }
                    //             canTypes[element.can_id].push(element);
                    //         });

                    //         const msgsByType = Object.values(canTypes);
                    //         async.each(msgsByType, (msgs, callbackType)=>{
                    //             self.relayResponseDecoded(msgs, callbackType);
                    //         },(err)=>{
                    //             callbackParallel(null);
                    //         })
                    //     }
                    // ]);
                });

                //THIS RELAYS THE RAW VALUES
                self.relayResponse(self.tunitSettings.imei+'/measurements', value);
            });

            //Looking for relay broker
            self.refreshMqttSettings();

            self.logger.debug('Local MQTT Broker working in port ' + self.port);
        });
    }

    refreshMqttSettings() {
        let self = this;
        self.mqttSettings = [];
        self.hasMqttSettings = false;
        self.mqttSettingsDecoded = [];
        self.hasMqttSettingsDecoded = false;


        self.app.service('mqttsettings').find({
            query: { $sort: { _id: -1 }, decoded:false},
          }).then((results)=> {
              if (results.data.length>0){
                let settings = results.data;
                self.mqttSettings = [...settings];
                self.hasMqttSettings = true;
                self.logger.debug('MQTT Relay configuration found: ' + JSON.stringify(self.mqttSettings));
              } else {
                  //No settings we cant relay
                  self.logger.debug('No MQTTSettings to relay');
              }
            },(reject)=>{
                self.logger.debug('Find relays rejected. No MQTTSettings to relay');
            }).catch((error)=>{
                //No settings we cant relay
                if (error){
                    self.logger.debug('No MQTTSettings to relay. '+ error);
                }
            });

            self.app.service('mqttsettings').find({
                query: { $sort: { _id: -1 }, decoded:true},
              }).then((results)=> {
                  if (results.data.length>0){
                    let settings = results.data;
                    self.mqttSettingsDecoded = [...settings];
                    self.hasMqttSettingsDecoded = true;
                    self.logger.debug('MQTT Decoded Relay configuration found: ' + JSON.stringify(self.mqttSettingsDecoded));
                  } else {
                      //No settings we cant relay
                      self.logger.debug('No MQTTSettings Decoded to relay');
                  }
                },(reject)=>{
                    self.logger.debug('Find relays rejected. No MQTTSettings Decoded to relay');
                }).catch((error)=>{
                    //No settings we cant relay
                    if (error){
                        self.logger.debug('No MQTTSettings Decoded to relay. '+ error);
                    }
                });
    }

    newMqttSettings(newSettings){
        let self = this;
        self.refreshMqttSettings();
        // this.hasMqttSettings = true;
        // this.mqttSettings = newSettings;
        // self.logger.debug('Relay MQTT settings updated: ' + JSON.stringify(newSettings));
    }

    relayResponse(topic, value){
        let self = this;

        if (self.hasMqttSettings===false){

        } else {
            
            async.each(self.mqttSettings, (mqttSettings, callback) => {
                self.logger.debug('MQTT sent to : '+ mqttSettings.brokerUrl + '/' + topic);
                mqttClient.sendMsg(mqttSettings.brokerUrl,topic, value.payload);
                callback(null);
            }, (error) =>{

            });
           
        }
    };

    relayResponseDecoded(topic, value){
        let self = this;

        if (self.hasMqttSettingsDecoded===false){
        } else {
            async.each(self.mqttSettingsDecoded, (settings, callback) => {
                self.logger.debug('MQTT Decoded sent to : '+ settings.brokerUrl + '/' + topic);
                mqttClient.sendMsg(settings.brokerUrl,topic, value.payload);
                callback(null);
            }, (error) =>{

            });
        }
    };

    publishToDevice(topic, payload){
        let self = this;
        let payloadStr = '{ "uuid":"' + payload.uuid + '", "key": "' + payload.key + '" ';

        if (payload.value){

            let stringValues = JSON.stringify(payload.value);
            // let valueKeys = Object.keys(payload.value);

            // valueKeys.forEach(aKey => {
            //         payloadStr+= ', "'+aKey+'":"'+payload.value[aKey]+'"';
            // });

            stringValues = stringValues.replace('{', '');
            stringValues = stringValues.replace('}', '');
            payloadStr += ', '+stringValues;
        } 


        payloadStr+= '}';

        self.logger.debug('Publishing mqtt to: ' + topic + ' Payload: ' + payloadStr);

        mqttClient.sendMsg('mqtt://127.0.0.1:'+this.port, this.tunitSettings.imei+topic, payloadStr);
    }


    isBusy(){
        return this.stackOfCommands.length>0;
    }
    sendCommand(command){
        var payload = {};
        payload.key = command.key;
        payload.uuid = command.id;
        if (command.value){
            payload.value = command.value;
        }

        if (command.can_send){
            payload.can_send = command.can_send;
        }
        
        this.publishToDevice(command.topic, payload);
    }

    // sendCommands(listOfCommands){
    //     this.stackOfCommands = [];
    //     for (let index = 0; index < listOfCommands.length; index++) {
    //         this.stackOfCommands.push(listOfCommands[index]);
    //     }

    //     this.proccessStackOfCommands();
    // }


    sendRemoteCommands(listOfCommands, resolve, reject ){
        let self = this;

        self.logger.debug('New remote command send request: ' + JSON.stringify(listOfCommands));
        this.stackOfCommands = [];
        for (let index = 0; index < listOfCommands.length; index++) {
            this.stackOfCommands.push(listOfCommands[index]);
        }

        this.currentCommand.resolve = resolve;
        this.currentCommand.reject = reject;

        
        let numSecondsTimeout = self.tunitSettings.timeout;
        setTimeout(()=>{
            reject({message: 'Timeout. No response received from TUNIT after ' + numSecondsTimeout + ' seconds'}); 
            self.stackOfCommands = [];
            self.currentCommand.id ='';
        },
        numSecondsTimeout*1000);

        this.proccessStackOfCommands();
    }

    proccessStackOfCommands(){
        let self = this;

        if (this.stackOfCommands.length>0){
            let currentCommand = this.stackOfCommands.shift();
            this.currentCommand.id = currentCommand.id;
            self.logger.debug('New remote command request: ' + JSON.stringify(currentCommand));
            this.sendCommand(currentCommand);
        } else {
            //All commands succes, we return 0k
            this.currentCommand.resolve({});
        }
    }

	stop(){
		this.server.close();
    }
    
}

module.exports = MQTTLocalBroker;



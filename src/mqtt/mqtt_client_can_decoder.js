'use strict';

const async = require('async');
const canDecoder = require('../can_decoder')
var mqtt = require('mqtt');
const mqttClient = require('./mqtt_client.js');

var myArgs = process.argv.slice(2);

var imei = myArgs[0];
var redirectMqttBroker = 'mqtt://127.0.0.1:1883';

var client  = mqtt.connect('mqtt://127.0.0.1:1885')
 
client.on('connect', function () {
  client.subscribe(imei+'/measurements', function (err) {
    if (!err) {
      console.log('Subscribed to '+ imei+'/measurements');
    }
  })
})
 
client.on('message', function (topic, message) {

  //console.log('New message: ' + message.toString());
  let measurements = JSON.parse(message.toString());



  let timestamps = Object.keys(measurements);
  timestamps.sort(function(a, b) {
      return Number(a) - Number(b);
  });

  async.map(timestamps, function(aTimestamp, callback){
      let aMeasurement = measurements[aTimestamp];
      let aCanmsg = {};
      aCanmsg.can_id = aMeasurement['can.id'];
      aCanmsg.can_dlc = aMeasurement['can.dlc'];
      aCanmsg.can_data = aMeasurement['can.data'];
      aCanmsg.can_type = aMeasurement['can.type'];
      aCanmsg.can_timestamp = Number(aTimestamp);
      callback(null, aCanmsg);
  }, function(err, results){

    let canTypes = {};
    results.forEach(element => {
        if (!(element.can_id in canTypes)){
            canTypes[element.can_id] = [];
        }
        canTypes[element.can_id].push(element);
    });

    const msgsByType = Object.values(canTypes);
    async.each(msgsByType, (msgs, callbackType)=>{
        canDecoder.decodeMin(msgs, '../../dbc/HYP-CAN_v01__and__iEV7S-CCAN.dbc', (result, lastValueId)=>{
            // async.each(self.mqttSettingsDecoded, (mqttSettings, callback) => {
                if (!lastValueId.startsWith("Unknown")){
                    const topic = 'mqttkit-1/tunit/'+imei+'/'+lastValueId+'/tc.json';
                    //console.log('MQTT DECODED sent to : '+ redirectMqttBroker + '/' + topic);
                    mqttClient.sendMsg(redirectMqttBroker,topic, JSON.stringify(result));
                }
                 callbackType(null);
           //  }, (error) =>{
           //      endCallback(null);
           //  });    
         });
    },(err)=>{
        //console.log('Err: ' + JSON.stringify(err));
    })

  });





});

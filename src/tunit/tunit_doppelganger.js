'use strict';

var mqtt = require('mqtt');
var async = require('async');
var config = require('./config');
var fs = require('fs');
var client  = mqtt.connect(config.host);
const lineByLine = require('n-readlines');
const liner = new lineByLine(config.tracesFile);


/*****************************************/
// Logger
const { createLogger, format, transports } = require('winston');
const handler = require('@feathersjs/errors/handler');
const { set } = require('@feathersjs/feathers/lib/application');
const { combine, timestamp, label, prettyPrint, colorize, simple, printf} = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});


const timezoned = () => {
  return new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid'
  });
};

var logger = createLogger({
  level: config.logLevel,
  format: combine(
    colorize(),
    format.splat(),
    timestamp({ format: timezoned }),
    myFormat
  ),
  transports: [new transports.Console()]
})
/*****************************************/

let isActive = false;
let traces = [];
let currentIndexMeasurement = 0;
let maxMeasurements = 0;
let filterIds = [];


let parseTracesFile = function(aLiner, callback){

    let line;
    let lineNumber = 0;
     
    while (line = aLiner.next()) {
        //console.log('Line ' + lineNumber + ': ' + line.toString('ascii'));
        if (lineNumber>=17){ //Skip header
            let lineNoSpaces = line.toString('utf8').replace(/\s+/g,' ')
            let tokens = lineNoSpaces.split(' ');
            let msg = {};
            msg.tsOffset = parseFloat(tokens[2]);
            msg.type = tokens[3];
            msg.id = tokens[4];
            msg.length = parseInt(tokens[5]);
            let bytes = tokens.slice(6, 14);
            msg.data = bytes.join('');
            traces.push(msg);
            maxMeasurements++;
        }
        
        lineNumber++;
    }

    callback();
};


let writeSettingsHandler = function(topic, message){
  let settings = JSON.parse(message.toString());
  logger.debug('New write settings received ('+ settings.uuid+'): ' + JSON.stringify(settings));


  if (settings.key==='TUNIT.CAN_FILTER'){

    let elements = settings.value.split(/[:,]+/);
    let ids = elements.filter(function(v, i) {
      return i % 2 == 0;
    });

    async.map(ids, (id, callbackMap)=>{
        var newId = id;
        if (id.length>4) newId = newId.substring(0,4);

        while (newId.length<4){
          newId = '0' + newId;
        }
          
        callbackMap(null, newId);
    }, (err, cleanedIds)=>{
      filterIds = cleanedIds.slice();
    });

  }

  let responseMsg = {};
  responseMsg.uuid = settings.uuid;
  responseMsg.result = 'OK';

  client.publish(config.imei+config.topicResponseWriteSettings, JSON.stringify(responseMsg), (err)=>{
    if (err){
      logger.debug('Error publishing write settings response: '+ err);
    } else {
      logger.debug('Write settings response sent.');
    }
  });

};

let executeCommandHandler = function(topic, message){
  let command =JSON.parse(message.toString());
  logger.debug('New command received ('+ command.uuid+'): ' + JSON.stringify(command));


  if (command.key == 'TUNIT.CAN_ENABLE_RX_CMD'){
      isActive = true;
  } else if (command.key == 'TUNIT.CAN_DISABLE_RX_CMD'){
      isActive = false;
  }

  let responseMsg = {};
  responseMsg.uuid = command.uuid;
  responseMsg.result = 'OK';

  client.publish(config.imei+config.topicResponseExecuteCommand, JSON.stringify(responseMsg), (err)=>{
    if (err){
      logger.debug('Error publishing execute command response: '+ err);
    } else {
      logger.debug('Execute command response sent.');
    }
  });

};


let sendMeasurement = function(){

  if (isActive){
    let max = currentIndexMeasurement + config.sendMeasurementsCountPerMesage;
    if (max>maxMeasurements){
      max = maxMeasurements;
    }
  
    let currentMeasurements = traces.slice(currentIndexMeasurement, max);
  
    let timestamp = Date.now();
    let baseOffset = Number(currentMeasurements[0].tsOffset)*1000;

    async.map(currentMeasurements, function(aMeasurement, callback){
        let offset = Number(aMeasurement.tsOffset)*1000 -baseOffset;
        let canTimestamp = Number(timestamp)*1000 + offset;

        let aCanMsg = {};
        aCanMsg.timestamp = canTimestamp.toString();
        aCanMsg.info = {}
        aCanMsg.info['can.id'] = aMeasurement.id;
        aCanMsg.info['can.dlc'] = aMeasurement.length;
        aCanMsg.info['can.data'] = aMeasurement.data;
        aCanMsg.info['can.type'] = aMeasurement.type;


        callback(null, aCanMsg);
    }, function(err, results){

        
       async.reduce(results, {}, (base, item, callbackReduce)=>{
         if (filterIds.length>0){
           if (filterIds.indexOf(item.info['can.id'])!=-1){
             base[item.timestamp] = item.info;
           }
         }
        callbackReduce(null, base);
       }, (err, finalMsg)=>{
          if (err){
            logger.debug('Error creating final msg: '+ err);
          } else {
            if (Object.keys(finalMsg).length>0){
              client.publish(config.imei+config.topicMeasurements, JSON.stringify(finalMsg), (err)=>{
                if (err){
                  logger.debug('Error publishing measurement: '+ err);
                } else {
                  logger.debug('New measurement sent.');
                }
              });
            }
          }
       })
    });

    currentIndexMeasurement=max;
    if (max==maxMeasurements){
      currentIndexMeasurement = 0;
      logger.debug('All traces sent. Starting again.');
    }  
  }

};

client.on('connect', function () {

    client.subscribe(config.imei+config.topicExecuteCommand, function (err) {
      if (!err) {
        logger.info('Suscribed to '+ config.imei+config.topicExecuteCommand);
      }
    });

    client.subscribe(config.imei+config.topicWriteSettings, function (err) {
        if (!err) {
          logger.info('Suscribed to '+ config.imei+config.topicWriteSettings);
        }
      });
});

client.on('message', function(topic, message){

    if (topic==config.imei+config.topicExecuteCommand){
        executeCommandHandler(topic, message);
    } else if (topic==config.imei+config.topicWriteSettings){
        writeSettingsHandler(topic, message);
    }
});

/**************************/
// MAIN
 
parseTracesFile(liner, ()=>{

    isActive = false;
    //Launch periodic sender

  setInterval(()=>{ 
      sendMeasurement();
  }, config.sendMeasurementsInterval);


});
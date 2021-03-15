/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

const { v4: uuidv4 } = require('uuid');
const logger = require('../../logger');

exports.Command = class Command {

  constructor (options,app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    

    const mqttLocalBroker =  this.app.get('mqttLocalBroker');

    if (mqttLocalBroker.isBusy()){
      return {error:'Busy'};
    }

    let newCommand = data;
    if (newCommand.command) {
      if (newCommand.command === 'start') {

        let commands = [];
  
         if (newCommand.filter){
          let filter = newCommand.filter;
          let filterIds = [];
          filter.forEach(element => {
            filterIds.push(element+':1FFFFFFF');
          });
          let filterCommand = {};
          filterCommand.topic = '/write_settings';
          filterCommand.id = uuidv4();
          filterCommand.key = 'TUNIT.CAN_FILTER';
          filterCommand.value = {};

          filterCommand.value.value = filterIds.join();
          commands.push(filterCommand);
        }
  
        let startCommand = {};
        startCommand.topic = '/execute_command';
        startCommand.id = uuidv4();
        startCommand.key = 'TUNIT.CAN_ENABLE_RX_CMD';
        commands.push(startCommand);


        let aPromise = new Promise((resolve, reject) => {
          mqttLocalBroker.sendRemoteCommands(commands, resolve, reject);
        });

        return aPromise;

        
  
  
      } else if (newCommand.command === 'stop') {
        let commands = [];
        let startCommand = {};
        startCommand.topic = '/execute_command';
        startCommand.id = uuidv4();
        startCommand.key = 'TUNIT.CAN_DISABLE_RX_CMD';
        commands.push(startCommand);

        let aPromise = new Promise((resolve, reject) => {
          mqttLocalBroker.sendRemoteCommands(commands, resolve, reject);
        });

        return aPromise;
      } else if (newCommand.command === 'cansend') {
        let hadAnError = false;
        let errorMessage = '';
        let commands = [];
        logger.debug('NewCommand: ' + JSON.stringify(newCommand));
        if (newCommand.value){

          let receivedValue = newCommand.value;
          let cansendCommand = {};
          cansendCommand.topic = '/execute_command';
          cansendCommand.id = uuidv4();
          cansendCommand.key = 'TUNIT.CAN_SEND_CMD';
          cansendCommand.value = {};

          if (receivedValue['CAN_SEND_ID']===undefined){
            hadAnError = true;
            errorMessage = '"CAN_SEND_ID" field required.';
          }

          if (receivedValue['CAN_SEND_DLC']===undefined){
            hadAnError = true;
            errorMessage = '"CAN_SEND_DLC" field required.';
          }

          if (receivedValue['CAN_SEND_DATA']===undefined){
            hadAnError = true;
            errorMessage = '"CAN_SEND_DATA" field required.';
          }

          if (receivedValue['CAN_SEND_RTR_FLAG']===undefined){
            hadAnError = true;
            errorMessage = '"CAN_SEND_RTR_FLAG" field required.';
          }

          if (receivedValue['CAN_SEND_EFF_FLAG']===undefined){
            hadAnError = true;
            errorMessage = '"CAN_SEND_EFF_FLAG" field required.';
          }

          if (hadAnError===false){
            cansendCommand.value.CAN_SEND_ID = receivedValue['CAN_SEND_ID'];
            cansendCommand.value.CAN_SEND_DLC = receivedValue['CAN_SEND_DLC'];
            cansendCommand.value.CAN_SEND_DATA = receivedValue['CAN_SEND_DATA'];
            cansendCommand.value.CAN_SEND_RTR_FLAG = receivedValue['CAN_SEND_RTR_FLAG'];
            cansendCommand.value.CAN_SEND_EFF_FLAG = receivedValue['CAN_SEND_EFF_FLAG'];

            commands.push(cansendCommand);
          }

        } else {
          hadAnError = true;
          errorMessage = '"value" field required.';
        }

        if (hadAnError===true){
          return new Promise((resolve, reject)=> {
            reject({message: errorMessage});
          });
        } else {
          let aPromise = new Promise((resolve, reject) => {
            mqttLocalBroker.sendRemoteCommands(commands, resolve, reject);
          });
          return aPromise;
        }

      }

    }

    return new Promise((resolve, reject)=> {
      reject({message: 'Unknown command'});
    });
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};

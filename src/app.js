const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');
const changePassword = require('./auth.changePassword');

const mongoose = require('./mongoose');
const influxdb = require('./influxdb');

const mqttCan = require('./mqtt_can');
const MQTTLocalBroker = require('./mqtt/mqtt_local_broker');

const app = express(feathers());

const findOne = require('feathers-findone');





// Load app configuration
app.configure(configuration());

logger.level = app.get('logLevel');
app.set('logger',logger);

//MQTT LOCAL BROKER
var mqttLocalBroker = new MQTTLocalBroker(1885,app);
app.set('mqttLocalBroker', mqttLocalBroker);

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());

app.configure(findOne());

app.configure(mongoose);
app.configure(influxdb);

//app.configure(mqttCan);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);

app.configure(changePassword);

// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);


// Configure a middleware for 404s and the error handler
app.use(express.notFound());

app.use(express.errorHandler({ logger }));

logger.debug('Debug message');

app.hooks(appHooks);

// This is the local mqtt broker that receives messages and relay them to 
// a remote broker set using the endpoint /mqttsettings


app.service('tunitsettings').find({ 
    query: {
        $limit: 1,
        $sort: {
            createdAt: -1
        }
  }}).then((val)=>{
    if (val.data && val.data.length===1){
        //After set the settingf, automatically starts again
        mqttLocalBroker.setTunitSettings(val.data[0]);
    } else {
        //Start with no settings
        mqttLocalBroker.start();
    }
}, (rejected)=>{
    logger.debug('Query looking for Tunit Settings rejected: '+ rejected);
    mqttLocalBroker.start();
}).catch((err)=>{
    logger.debug('Query looking for Tunit Settings failed: '+ err);
     //Start with no settings
     mqttLocalBroker.start();
});



module.exports = app;

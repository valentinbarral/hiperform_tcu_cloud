/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const fs = require('fs');
const https = require('https');
const { exit } = require('process');
const usesHttps = app.get('https');
let server;

if (usesHttps){
  try {
    server = https.createServer({
      key: fs.readFileSync('privatekey.pem'),
      cert: fs.readFileSync('certificate.pem')
    }, app).listen(port);
    app.setup(server);
  } catch (exception){
    logger.error("No valid certificates. Files privatekey.pem and certificate.pem not found.");
    exit(0);
  }

} else {
    server = app.listen(port);
}


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);

// const { createLogger, format, transports } = require('winston');

// // Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
// const logger = createLogger({
//   // To see more detailed errors, change this to 'debug'
//   level: 'info',
//   format: format.combine(
//     format.splat(),
//     format.simple()
//   ),
//   transports: [
//     new transports.Console()
//   ],
// });

// module.exports = logger;


const { createLogger, format, transports } = require('winston');
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
  level: 'info',
  format: combine(
    colorize(),
    format.splat(),
    timestamp({ format: timezoned }),
    myFormat
  ),
  transports: [new transports.Console()]
})

module.exports = logger;
const Influx = require("influx");

module.exports = function (app) {
    const influx = new Influx.InfluxDB({
        host: "localhost",
        port: 8086,
        database: "can_messages",
        schema: [
            {
                measurement: 'can_msg',
                fields: { data: Influx.FieldType.STRING},
                tags: [ 'id', 'dlc', 'type']
            }
        ]
    });

  app.set('influxdb', influx);
};

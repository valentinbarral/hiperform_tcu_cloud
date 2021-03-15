const { __esModule } = require("async")

module.exports= {
    "host": "mqtt://localhost:1885",
    //"imei": "359779080127729",
    "imei": "359779080127760",
    "logLevel": "debug",
    "tracesFile": "./Traza_Hiperform_Tecnalia_06_11_2020.trc",
    "sendMeasurementsInterval": 300,
    "sendMeasurementsCountPerMesage": 1000,
    "topicExecuteCommand": "/execute_command",
    "topicResponseExecuteCommand": "/execute_command_response",
    "topicWriteSettings": "/write_settings",
    "topicResponseWriteSettings": "/write_settings_response",
    "topicMeasurements": "/measurements",
    "mongodb": "mongodb://hiperform:hiperform@127.0.0.1:27017/hiperform"
  };

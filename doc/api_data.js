define({ "api": [
  {
    "type": "post",
    "url": "/authentication",
    "title": "Authenticate user",
    "version": "1.0.0",
    "name": "Authentication",
    "group": "Authentication",
    "description": "<p>Authenticates a user using email-password and returns an access token. The access token must be included in the header of every request in the field &quot;Authorization&quot;.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>User password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "accessToken",
            "description": "<p>The access token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"accessToken\": \"eyJhbGciOiJIUzI1NiIsInH5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOaI1ZDB2ODRiODlkMjkyZmM4MDM4YzNmMDUiLCJpYXQiOjE1NjA3OTcxNDEsImV4cCI6MTU2MDg4MzU0MSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiYTg0MmQ1NjQtOGVjNi00YTE3LWE1ZjMtYzllYjE3MjVkZTRkIn0.ly9x-9Vc8k698V4k8HH1ZW5ueCPaR6egxEnVkaFwukc\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/authentication"
      }
    ]
  },
  {
    "type": "post",
    "url": "/authentication/changePassword",
    "title": "Change password",
    "version": "1.0.0",
    "name": "Change_Password",
    "group": "Authentication",
    "description": "<p>Change the user password</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>The old password.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>The new password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "_id",
            "description": "<p>User identifier.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "createdAt",
            "description": "<p>User creation date.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>User update date..</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"_id\": \"5d0784b89d292fc8038c3f05\",\n    \"email\": \"valentin.barral@udc.es\",\n    \"createdAt\": \"2019-06-17T12:16:56.550Z\",\n    \"updatedAt\": \"2019-06-17T19:51:18.704Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/authentication/changePassword"
      }
    ]
  },
  {
    "type": "post",
    "url": "/command",
    "title": "Create a new command",
    "version": "1.0.0",
    "name": "CreateCommand",
    "group": "Command",
    "description": "<p>Creates a new command to launch or stop a TU experiment.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"start\"",
              "\"stop\""
            ],
            "optional": false,
            "field": "command",
            "description": "<p>Command to launch.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "filter",
            "description": "<p>A set of CAN identifiers. If the filter is empty, all messages are forwarded. Otherwise, only messages with an identifier present in the filter are forwarded.</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "timeout",
            "description": "<p>If set, the experiment ends automatically after this number of seconds.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "_id",
            "description": "<p>Object identifier.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "allowedValues": [
              "\"start\"",
              "\"stop\""
            ],
            "optional": false,
            "field": "command",
            "description": ""
          },
          {
            "group": "201",
            "type": "string",
            "optional": true,
            "field": "filter",
            "description": ""
          },
          {
            "group": "201",
            "type": "int",
            "optional": true,
            "field": "timeout",
            "description": ""
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n   \"filter\": [\n       \"0096\",\n       \"0095\"\n   ],\n   \"_id\": \"5d07e862696fd9efabcfebb7\",\n   \"command\": \"start\",\n   \"timeout\": 10,\n   \"createdAt\": \"2019-06-17T19:22:10.080Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "Command",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/command"
      }
    ]
  },
  {
    "type": "post",
    "url": "/mqttsettings",
    "title": "Create MQTT Settings",
    "version": "1.0.3",
    "name": "CreateMQTTSettings",
    "group": "MQTT_Settings",
    "description": "<p>Creates a new set of MQTT Settings.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "Parameter",
            "type": "bool",
            "optional": false,
            "field": "decoded",
            "description": "<p>Sends CAN messages decoded or not.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "_id",
            "description": "<p>Object identifier.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"_id\": \"5d07e53c0f5d3de82f751e85\",\n    \"brokerUrl\": \"mqtt://127.0.0.1:1883\",\n    \"decoded\" : true,\n    \"createdAt\": \"2019-06-17T19:08:44.857Z\"\n\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "MQTT_Settings",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/mqttsettings"
      }
    ]
  },
  {
    "type": "post",
    "url": "/mqttsettings",
    "title": "Create MQTT Settings",
    "version": "1.0.0",
    "name": "CreateMQTTSettings",
    "group": "MQTT_Settings",
    "description": "<p>Creates a new set of MQTT Settings. The last created value is the active one.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access toke</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "topic",
            "description": "<p>MQTT Topic to publish.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "publishInterval",
            "description": "<p>Publish interval (mili seconds).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "_id",
            "description": "<p>Object identifier.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "topic",
            "description": "<p>MQTT Topic to publish.</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "publishInterval",
            "description": "<p>Publish interval (mili seconds).</p>"
          },
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation date.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"_id\": \"5d07e53c0f5d3de82f751e85\",\n    \"brokerUrl\": \"mqtt://127.0.0.1:1883\",\n    \"topic\": \"TEST_TOPIC\",\n    \"publishInterval\": \"3000\",\n    \"createdAt\": \"2019-06-17T19:08:44.857Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "MQTT_Settings",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/mqttsettings"
      }
    ]
  },
  {
    "type": "get",
    "url": "/mqttsettings",
    "title": "Request MQTT Settings",
    "version": "1.0.3",
    "name": "FindMQTTSettings",
    "group": "MQTT_Settings",
    "description": "<p>Get a list of MQTT Settings.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access toke</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example query:",
        "content": "/mqttsettings?$limit=4&$sort[createdAt]=-1&$select[]=brokerUrl&$select[]=topic",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>An array of MQTTSettings objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "total",
            "description": "<p>Total number of objects that match the criteria.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "limit",
            "description": "<p>Number of returned objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of skipped objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data._id",
            "description": "<p>Object identifier.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "Success 200",
            "type": "bool",
            "optional": false,
            "field": "data.decoded",
            "description": "<p>Send decoded data or raw CAN messages.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>Created date.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.updatedAt",
            "description": "<p>Update date.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"total\": 3,\n   \"limit\": 10,\n   \"skip\": 0,\n   \"data\": [\n       {\n           \"_id\": \"5d0397a223095184862d277f\",\n           \"brokerUrl\": \"mqtt://127.0.0.0:1883\",\n           \"createdAt\": \"2019-06-14T12:48:34.900Z\",\n           \"updatedAt\": \"2019-06-14T12:48:34.900Z\",\n           \"decoded\": true\n       }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "MQTT_Settings",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/mqttsettings"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$limit",
            "description": "<p>Limit the number of objects returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$skip",
            "description": "<p>Skip a number of objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$sort",
            "description": "<p>Set the sorting fields. 1 ascending, -1 descending.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "$select",
            "description": "<p>Select only some fields of the returned objects.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/mqttsettings",
    "title": "Request MQTT Settings",
    "version": "1.0.0",
    "name": "FindMQTTSettings",
    "group": "MQTT_Settings",
    "description": "<p>Get a list of MQTT Settings. The last created value is the active one.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access toke</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example query:",
        "content": "/mqttsettings?$limit=4&$sort[createdAt]=-1&$select[]=brokerUrl&$select[]=topic",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>An array of MQTTSettings objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "total",
            "description": "<p>Total number of objects that match the criteria.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "limit",
            "description": "<p>Number of returned objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of skipped objects.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data._id",
            "description": "<p>Object identifier.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.brokerUrl",
            "description": "<p>MQTT Broker Url.</p>"
          },
          {
            "group": "Success 200",
            "type": "bool",
            "optional": false,
            "field": "data.decoded",
            "description": "<p>Send decoded data or raw CAN messages.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>Created date.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.updatedAt",
            "description": "<p>Update date.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"total\": 3,\n   \"limit\": 10,\n   \"skip\": 0,\n   \"data\": [\n       {\n           \"_id\": \"5d0397a223095184862d277f\",\n           \"brokerUrl\": \"mqtt://127.0.0.0:1883\",\n           \"topic\": \"TEST_TOPIC\",\n           \"publishInterval\": \"3000\",\n           \"createdAt\": \"2019-06-14T12:48:34.900Z\",\n           \"updatedAt\": \"2019-06-14T12:48:34.900Z\"\n       }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/doc/doc.js",
    "groupTitle": "MQTT_Settings",
    "sampleRequest": [
      {
        "url": "https://hiperform.gtec.udc.es:4434/mqttsettings"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$limit",
            "description": "<p>Limit the number of objects returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$skip",
            "description": "<p>Skip a number of objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "$sort",
            "description": "<p>Set the sorting fields. 1 ascending, -1 descending.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "$select",
            "description": "<p>Select only some fields of the returned objects.</p>"
          }
        ]
      }
    }
  }
] });

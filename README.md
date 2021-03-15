# Hiperform Telematic Unit Cloud Server

This software offers the following features

- To receive MQTT data from a Hiperform telematic unit and make them persistent in a database.
- To offer an API REST that allows:
  - Consult the data of the received CAN messages.
  - Consult the data of the received CAN messages translated to engineering units.
  - Start or stop experiments in the telematic unit.
  - Define CAN filters to receive messages only from some defined identifiers.
  - Configure a remote MQTT broker to resend in real time the MQTT messages received from the telematic unit.

## Requirements

- ```node```
- ```npm```
- ```mongodb```: the server expects this connection url: *mongodb://hiperform:hiperform@127.0.0.1:27017/hiperform*, so it is necessary to create a *hiperform*:*hiperform* user with administrator rights in a database also named *hiperform*.

## Install

```
npm install
```

## Execution

There are different configurations. 

**Default mode**:
Launchs a HTTP server in localhost:3030, with logLevel= debug.

```
npm start
```

**Production mode**:
Launchs a HTTPS server in https://hiperform.gtec.udc.es:4434, with logLevel= info.

```
NODE_ENV=production npm start
```

The files *certificate.pem* and *privatekey.pem* must be present to launch the https version.

**Debug no log**:
Launchs a HTTP server in in localhost:3030, with logLevel= info.

```
 NODE_ENV=debug_no_log npm start
```

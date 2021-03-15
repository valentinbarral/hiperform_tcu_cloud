
/**
*
* @apiDefine MQTTSettingsSuccess
*
* @apiSuccess {string} data._id Object identifier.
* @apiSuccess {string} data.brokerUrl MQTT Broker Url.
* @apiSuccess {bool} data.decoded Send decoded data or raw CAN messages.
* @apiSuccess {string} data.createdAt   Created date.
* @apiSuccess {string} data.updatedAt Update date.
*/

/**
*
* @apiDefine CANMsgSuccess
*
* @apiSuccess {string} data._id Object identifier.
* @apiSuccess {string} data.can_type CAN message type.
* @apiSuccess {string} data.can_id CAN message identifier.
* @apiSuccess {string} data.can_dlc CAN message DLC field.
* @apiSuccess {string} data.can_data CAN message payload.
* @apiSuccess {string} data.can_timestamp Received timestamp
*/

/**
*
* @apiDefine QueryParams
*
* @apiParam {int} [ $limit ]   Limit the number of objects returned.
* @apiParam {int} [$skip]   Skip a number of objects.
* @apiParam {int} [$sort]  Set the sorting fields. 1 ascending, -1 descending. 
* @apiParam {string} [$select]  Select only some fields of the returned objects.
*/

/**
*
* @apiDefine PaginationSuccess
* @apiSuccess {int} total Total number of objects that match the criteria.
* @apiSuccess {int} limit Number of returned objects.
* @apiSuccess {int} skip Number of skipped objects.
*/

 /**
 * @api {get} /mqttsettings Request MQTT Settings
 * @apiVersion 1.0.0
 * @apiName FindMQTTSettings
 * @apiGroup MQTT Settings
 * @apiDescription Get a list of MQTT Settings. The last created value is the active one.
 * 
 * @apiHeader {String} Authorization Access toke
 * 
 * @apiUse QueryParams
 *
 * @apiExample Example query:
 * /mqttsettings?$limit=4&$sort[createdAt]=-1&$select[]=brokerUrl&$select[]=topic
 *
 * @apiUse PaginationSuccess
 * @apiSuccess {Object[]} data An array of MQTTSettings objects.
 * @apiUse MQTTSettingsSuccess
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
 *    "total": 3,
 *    "limit": 10,
 *    "skip": 0,
 *    "data": [
 *        {
 *            "_id": "5d0397a223095184862d277f",
 *            "brokerUrl": "mqtt://127.0.0.0:1883",
 *            "topic": "TEST_TOPIC",
 *            "publishInterval": "3000",
 *            "createdAt": "2019-06-14T12:48:34.900Z",
 *            "updatedAt": "2019-06-14T12:48:34.900Z"
 *        }
 * }
 *
 */

 /**
 * @api {get} /mqttsettings Request MQTT Settings
 * @apiVersion 1.0.3
 * @apiName FindMQTTSettings
 * @apiGroup MQTT Settings
 * @apiDescription Get a list of MQTT Settings.
 * @apiUse QueryParams
 * 
 * @apiHeader {String} Authorization Access toke
 *
 * @apiExample Example query:
 * /mqttsettings?$limit=4&$sort[createdAt]=-1&$select[]=brokerUrl&$select[]=topic
 *
 * @apiUse PaginationSuccess
 * @apiSuccess {Object[]} data An array of MQTTSettings objects.
 * @apiUse MQTTSettingsSuccess
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
 *    "total": 3,
 *    "limit": 10,
 *    "skip": 0,
 *    "data": [
 *        {
 *            "_id": "5d0397a223095184862d277f",
 *            "brokerUrl": "mqtt://127.0.0.0:1883",
 *            "createdAt": "2019-06-14T12:48:34.900Z",
 *            "updatedAt": "2019-06-14T12:48:34.900Z",
 *            "decoded": true
 *        }
 * }
 *
 */


/**
 * @api {post} /mqttsettings Create MQTT Settings
 * @apiVersion 1.0.0
 * @apiName CreateMQTTSettings
 * @apiGroup MQTT Settings
 * @apiDescription Creates a new set of MQTT Settings. The last created value is the active one.
 *
 * @apiHeader {String} Authorization Access toke
 * 
 * @apiParam {string} brokerUrl MQTT Broker Url.
 * @apiParam {string} topic   MQTT Topic to publish.
 * @apiParam {string} publishInterval Publish interval (mili seconds).
 *
 * @apiSuccess (201) {string} _id Object identifier.
 * @apiSuccess (201) {string} brokerUrl MQTT Broker Url.
 * @apiSuccess (201) {string} topic   MQTT Topic to publish.
 * @apiSuccess (201) {string} publishInterval Publish interval (mili seconds).
 * @apiSuccess (201) {string} createdAt Creation date.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "_id": "5d07e53c0f5d3de82f751e85",
 *     "brokerUrl": "mqtt://127.0.0.1:1883",
 *     "topic": "TEST_TOPIC",
 *     "publishInterval": "3000",
 *     "createdAt": "2019-06-17T19:08:44.857Z"
 * }
 *
 */


/**
 * @api {post} /mqttsettings Create MQTT Settings
 * @apiVersion 1.0.3
 * @apiName CreateMQTTSettings
 * @apiGroup MQTT Settings
 * @apiDescription Creates a new set of MQTT Settings.
 * 
 * @apiHeader {String} Authorization Access token
 *
 * @apiParam {string} brokerUrl MQTT Broker Url.
 * @apiParam {bool} decoded  Sends CAN messages decoded or not.
 *
 * @apiSuccess (201) {string} _id Object identifier.
 * @apiSuccess (201) {string} brokerUrl MQTT Broker Url.
 * @apiSuccess (201) {string} createdAt Creation date.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "_id": "5d07e53c0f5d3de82f751e85",
 *     "brokerUrl": "mqtt://127.0.0.1:1883",
 *     "decoded" : true,
 *     "createdAt": "2019-06-17T19:08:44.857Z"
 * 
 * }
 *
 */



 /**
 * @api {post} /command Create a new command
 * @apiVersion 1.0.0
 * @apiName CreateCommand
 * @apiGroup Command
 * @apiDescription Creates a new command to launch or stop a TU experiment.
 * 
 * @apiHeader {String} Authorization Access token
 *
 * @apiParam {string="start","stop"} command Command to launch.
 * @apiParam {string} [filter] A set of CAN identifiers. If the filter is empty, all messages are forwarded. Otherwise, only messages with an identifier present in the filter are forwarded.
 * @apiParam {int} [timeout] If set, the experiment ends automatically after this number of seconds.
 * 
 * @apiSuccess (201) {string} _id Object identifier.
 * @apiSuccess (201) {string="start","stop"} command
 * @apiSuccess (201) {string} [filter] 
 * @apiSuccess (201) {int} [timeout]
 * @apiSuccess (201) {string} createdAt Creation date.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *{
 *    "filter": [
 *        "0096",
 *        "0095"
 *    ],
 *    "_id": "5d07e862696fd9efabcfebb7",
 *    "command": "start",
 *    "timeout": 10,
 *    "createdAt": "2019-06-17T19:22:10.080Z"
 *}
 *
 */


 
 /**
 * @api {post} /authentication Authenticate user
 * @apiVersion 1.0.0
 * @apiName Authentication
 * @apiGroup Authentication
 * @apiDescription Authenticates a user using email-password and returns an access token. The access token must be included in the header of every request in the field "Authorization".
 *
 * @apiParam {string} email User email.
 * @apiParam {string} password User password.
 * 
 * @apiSuccess (201) {string} accessToken The access token.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInH5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOaI1ZDB2ODRiODlkMjkyZmM4MDM4YzNmMDUiLCJpYXQiOjE1NjA3OTcxNDEsImV4cCI6MTU2MDg4MzU0MSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiYTg0MmQ1NjQtOGVjNi00YTE3LWE1ZjMtYzllYjE3MjVkZTRkIn0.ly9x-9Vc8k698V4k8HH1ZW5ueCPaR6egxEnVkaFwukc"
 * }
 *
 */

 /**
 * @api {post} /authentication/changePassword Change password
 * @apiVersion 1.0.0
 * @apiName Change Password
 * @apiGroup Authentication
 * @apiDescription Change the user password
 * 
 * @apiHeader {String} Authorization Access token
 *
 * @apiParam {string} oldPassword The old password.
 * @apiParam {string} password The new password.
 * 
 * @apiSuccess (201) {string} _id User identifier.
 * @apiSuccess (201) {string} email User email.
 * @apiSuccess (201) {string} createdAt User creation date.
 * @apiSuccess (201) {string} updatedAt User update date..
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "_id": "5d0784b89d292fc8038c3f05",
 *     "email": "valentin.barral@udc.es",
 *     "createdAt": "2019-06-17T12:16:56.550Z",
 *     "updatedAt": "2019-06-17T19:51:18.704Z"
 * }
 *
 */


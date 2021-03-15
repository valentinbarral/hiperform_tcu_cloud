import sys
import paho.mqtt.client as mqtt
import time
import json 
import cantools
import math
from datetime import datetime
from influxdb import InfluxDBClient
import threading, queue

#DB: tunit_IMEI
#DATA: DECODED_ID

class CanDecoder:
    def __init__(self, tunitImei, dbcPath):
        self.tunitImei = tunitImei
        self.dbcPath = dbcPath
        self.mqttClient = mqtt.Client("Tunit Main")
        #self.mqttClientRelay = mqtt.Client("Tunit Relay")
        self.dbc = cantools.database.load_file(dbcPath)
        self.mqttClient.on_connect = self.on_connect
        self.mqttClient.on_message = self.on_message
        #self.mqttClientRelay.on_connect = self.on_connect_relay
        self.influxdbClient = {}
        self.counterPoints = 0
        self.q = queue.Queue()
        #self.mqttClientRelay.on_publish = self.on_publish_relay

    def on_connect(self, client, userdata, flags, rc):
        
        if (self.mqttClient.is_connected):
            print("Connected to MQTT Broker")
            self.mqttClient.subscribe(self.tunitImei+'/measurements')
        else:
            print("Cant connect to MQTT Broker")
            self.start()

    # def on_connect_relay(self, client, userdata, flags, rc):
        
    #     if (self.mqttClientRelay.is_connected):
    #         print("Connected to MQTT Broker RELAY")
    #     else:
    #         print("Cant connect to MQTT Broker RELAY")

    # def on_publish_relay(self, client, userdata,mid):
    #     print("Published on relay " + str(mid))

  

    # def build_msgs_dataframe(self, measurement):
    #     #print(measurement)
    #     dataInt = list(map(lambda a :int(a,16) , (measurement['can.data']).split()))
    #     result = [0 , int(measurement['can.id'], 16), dataInt]
    #     return result

    # # The callback for when a PUBLISH message is received from the server.
    # def on_message(self, client, userdata, msg):
    #     measurements = json.loads(msg.payload)
    #     timestamps = measurements.keys()
    #     canPayloads = measurements.values()
    #     results = list(map(self.build_msgs_dataframe, canPayloads))
    #     d = {'IDE':  [item[0] for item in results], 'ID': [item[1] for item in results], 'DataBytes':[item[2] for item in results], 'TimeStamp':timestamps}
    #     df = pd.DataFrame(data=d)
    #     df_phys_1 = self.df_decoder.decode_frame(df)
    #     print(df_phys_1)

    def decode_single_msg(self, measurement):
        #print(measurement)
        aTimestamp = measurement[0]
        payload = measurement[1]
        aTimestampDay = int(math.floor(float(aTimestamp)/1000000))
        microSeconds = int(aTimestamp) - int(aTimestampDay)*100000
        timeDayStr = datetime.utcfromtimestamp(aTimestampDay).strftime('%Y-%m-%dT%H:%M:%S')
        time = timeDayStr+'.'+str(microSeconds)+'Z'
        frameId = int(payload['can.id'], 16)
        try:
            msg = self.dbc.get_message_by_frame_id(frameId)
            decoded= self.dbc.decode_message(frameId, (payload['can.data']).encode('ascii'))
            aCanmsg = {}
            aCanmsg['measurement'] = msg.name
            aCanmsg['fields'] = decoded
            aCanmsg['time'] = time
            aCanmsg['time_precision'] = 'u'

        except:
            aCanmsg = {}


        return aCanmsg


    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        #print("New Measurement")
        self.q.put(msg)
        print('*',end='',flush=True)
        self.counterPoints = self.counterPoints +1
        if (self.counterPoints>24):
            self.counterPoints =0
            print('')
        measurements = json.loads(msg.payload)

        timestamps = measurements.keys()
        canPayloads = measurements.values()
        mix = list(zip(timestamps, canPayloads))

        canMsgdToSave = list(map(self.decode_single_msg, mix))
        self.influxdbClient.write_points(canMsgdToSave)

    def procces_q(self):
        msg = self.q.get()
        print('*',end='')
        self.counterPoints = self.counterPoints +1
        if (self.counterPoints>24):
            self.counterPoints =0
            print('')
        measurements = json.loads(msg.payload)

        timestamps = measurements.keys()
        canPayloads = measurements.values()
        mix = list(zip(timestamps, canPayloads))

        canMsgdToSave = list(map(self.decode_single_msg, mix))
        self.influxdbClient.write_points(canMsgdToSave)      
        self.q.task_done()  
        
    def start(self):

        # try:
        #     self.mqttClientRelay.connect("localhost", 1883, 60)
        # except:
        #     print('Cant connect MQTT broker in 1883')
        #     #time.sleep(1)

        threading.Thread(target=self.procces_q, daemon=True).start()

        try:
            self.mqttClient.connect("localhost", 1885, 60)
        except:
            time.sleep(1)
            #return self.start()

        try:
            self.influxdbClient = InfluxDBClient('localhost', 8086, 'root', 'root', 'tunit_'+ str(self.tunitImei))
        except:
            print('Error connecting influxdb')

        try:
            #self.mqttClientRelay.loop_start()
            self.mqttClient.loop_forever()
        except KeyboardInterrupt:
            pass

        self.mqttClient.disconnect()
        #self.mqttClientRelay.disconnect()
        self.mqttClient.loop_stop()
        #self.mqttClientRelay.loop_stop()


dbc_path = './dbc/HYP-CAN_v01__and__iEV7S-CCAN.dbc'
canDecoder = CanDecoder(sys.argv[1], str(sys.argv[2]))
canDecoder.start()



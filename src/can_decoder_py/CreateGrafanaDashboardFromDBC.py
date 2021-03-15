import cantools
import sys, copy
import json
from grafana_api.grafana_face import GrafanaFace



def get_target(measurementId, signalId, templateTarget):
    templateTarget['alias'] = signalId
    templateTarget['fields'][0]['name'] = signalId
    templateTarget['select'][0][0]['params'][0] = signalId
    templateTarget['measurement'] = measurementId
    templateTarget['query'] = 'SELECT mean(\"%s\") FROM \"%s\" WHERE $timeFilter GROUP BY time($interval)' % (signalId, measurementId)
    return templateTarget


imei = str(sys.argv[1])
dbc_path = str(sys.argv[2])


with open('./dashboard_template.json') as template_dashboard:
    dashboard_template = json.load(template_dashboard)

with open('./panel_template.json') as template_panel:
    panel_template = json.load(template_panel)

with open('./target_template.json') as template_target: 
    target_template = json.load(template_target)

dbc = cantools.database.load_file(dbc_path)
msgs = dbc.messages
idPanel = 0
for msg in msgs:
    idPanel = idPanel +1
    name = msg.name
    print("- "+ name)
    signals = msg.signals
    panel = copy.deepcopy(panel_template)
    panel['datasource'] = "tunit_"+imei
    panel['title'] = "TUNIT: " + imei + " PARAMETER: " + name
    panel['id'] = idPanel
    panel['gridPos']['y'] = 1 + (idPanel -1) * 9
    for signal in signals:
        signalName = signal.name
        print("---- "+ signalName)
        target = get_target(name, signalName, copy.deepcopy(target_template))
        panel['targets'].append(target)
    dashboard_template['panels'].append(panel)

dashboard_template['title'] = "TUNIT "+imei

# with open('exit.json', 'w') as outfile:
#     json.dump(dashboard_template, outfile)

grafana_api = GrafanaFace(auth=('admin','wifigtecwifi'), host='193.144.50.239', port=3000)
try:
    grafana_api.dashboard.update_dashboard(dashboard={'dashboard': dashboard_template, 'folderId': 0, 'overwrite': False})
except:
    grafana_api.dashboard.update_dashboard(dashboard={'dashboard': dashboard_template, 'folderId': 0, 'overwrite': True})




            


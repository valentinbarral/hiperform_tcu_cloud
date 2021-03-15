const async = require('async');
var exec = require('child_process').exec;;

function decode(data, dbcPath, mainCallback) {
    async.concat(data, function (measurement, callbackConcat) {
        let res = 'vcan0 ' + measurement.can_id + ' ' + '[' + measurement.can_dlc + '] ' + measurement.can_data;
        callbackConcat(null, res);

    }, function (err, resultsConcat) {

        let str = resultsConcat.join('\n');
        exec('echo \'' + str + '\' | cantools decode --single-line ' + dbcPath, function (error, stdout, stderr) {

            const lines = stdout.match(/[^\r\n]+/g);
            //console.log('Lines[0]: ' + lines[0]);

            if (lines === null) {
                console.log('Error: ' + error);
                result = { error: error };
                return mainCallback(result);
            }

            let allDecoded = [];
            for (let j = 0; j < lines.length; j++) {
                let measurement = data[j];
                var decoded = {};
                decoded._id = measurement._id;
                decoded.timestamp = measurement.can_timestamp;
                const value = lines[j].substr(lines[j].indexOf('::') + 2, lines[j].indexOf('(') - lines[j].indexOf('::') - 2);
                // console.log('Value: ' + value);
                decoded.name = value;
                decoded.params = [];
                const arrayParams = (lines[j].substr(lines[j].indexOf('(') + 1, lines[j].length - lines[j].indexOf('(') - 2)).split(', ');
                //console.log('ArrayParams: ' + JSON.stringify(arrayParams));
                arrayParams.forEach(element => {

                    const noComma = element.replace(',', '');
                    const noPoints = noComma.replace(':', '');
                    const noSpaces = noPoints.replace(/ +(?= )/g, '');
                    const noBreaks = noSpaces.replace(/(\r\n|\n|\r)/gm, '');
                    const subelements = noBreaks.split(' ');

                    //console.log(JSON.stringify(subelements));
                    const val = {};
                    val.id = subelements[0];
                    try {
                        const valFloat = parseFloat(subelements[1])
                        val.value = valFloat;
                    } catch (error) {
                        val.value = subelements[1];
                    }

                    val.units = subelements[2];
                    decoded.params.push(val);
                });

                allDecoded.push(decoded);
            }

            result = allDecoded;
            return mainCallback(result);
        });
      });
    };

    function decodeMin(data, dbcPath,  mainCallback) {
        async.concat(data, function (measurement, callbackConcat) {
            let res = 'vcan0 ' + measurement.can_id + ' ' + '[' + measurement.can_dlc + '] ' + measurement.can_data;
            callbackConcat(null, res);
    
        }, function (err, resultsConcat) {
            
            let lastValueId = '';
            let str = resultsConcat.join('\n');
            //console.log('Results concant: '+ str)
            exec('echo \'' + str + '\' | cantools decode --single-line ' + dbcPath, function (error, stdout, stderr) {
    
                const lines = stdout.match(/[^\r\n]+/g);
                //console.log('Lines[0]: ' + lines[0]);
    
                if (lines === null) {
                    console.log('Error: ' + error);
                    result = { error: error };
                    return mainCallback(result);
                }
    
                let allDecoded = {};
                for (let j = 0; j < lines.length; j++) {
                    let measurement = data[j];
                    //tsMs = Math.floor(measurement.can_timestamp/1000.0);
                    tsMs = measurement.can_timestamp;
                    allDecoded[tsMs] = {};

                    const value = lines[j].substr(lines[j].indexOf('::') + 2, lines[j].indexOf('(') - lines[j].indexOf('::') - 2);
                    // console.log('Value: ' + value);
                    lastValueId = value.split(" ").join("");
                    //decoded.params = [];
                    const arrayParams = (lines[j].substr(lines[j].indexOf('(') + 1, lines[j].length - lines[j].indexOf('(') - 2)).split(', ');
                    //console.log('ArrayParams: ' + JSON.stringify(arrayParams));
                    arrayParams.forEach(element => {
    
                        const noComma = element.replace(',', '');
                        const noPoints = noComma.replace(':', '');
                        const noSpaces = noPoints.replace(/ +(?= )/g, '');
                        const noBreaks = noSpaces.replace(/(\r\n|\n|\r)/gm, '');
                        const subelements = noBreaks.split(' ');
    
                        //console.log(JSON.stringify(subelements));
                        const val = {};
                        val.id = subelements[0];
                        
                        try {
                            const valFloat = parseFloat(subelements[1])
                            val.value = valFloat;
                        } catch (error) {
                            val.value = subelements[1];
                        }
                        allDecoded[tsMs][val.id] = val.value;
                        //val.units = subelements[2];
                        //decoded.params.push(val);
                    });
                }
    
                result = allDecoded;
                return mainCallback(result, lastValueId);
            });
          });
        };

module.exports.decode = decode;
module.exports.decodeMin = decodeMin;
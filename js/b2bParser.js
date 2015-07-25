var fs = require('fs');
var request = require('request');
var dateFormat = require('dateformat');
var userId = 'CC0000001623';
var xml2js = require('xml2js');

var options = {
    url: 'https://www.nm.eurocontrol.int:16443/B2B_PREOPS/gateway/spec/18.5.0',
    json: false,
    agentOptions: {
        pfx: fs.readFileSync('./key/CC0000001623_500.p12'),
        passphrase: 'Wl2;Ti&urjQ'
    },
    headers: {
        'Content-Type': 'text/xml'
    },
};

function flightPlanList(arcid) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightPlanListRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
    '<endUserId>' + userId + '</endUserId>' +
    '<sendTime>' + timeString + '</sendTime>' +
    '<aircraftId>' + arcid + '</aircraftId>' + 
    '<nonICAOAerodromeOfDeparture>false</nonICAOAerodromeOfDeparture>' +
    '<airFiled>false</airFiled>' +
    '<nonICAOAerodromeOfDestination>false</nonICAOAerodromeOfDestination>' +
    '<estimatedOffBlockTime>';
    timeString = dateFormat(now, "yyyy-mm-dd") + " 00:00";
    xmlString = xmlString + '<wef>' + timeString + '</wef>';
    timeString = dateFormat(now, "yyyy-mm-dd") + " 23:59";
    xmlString = xmlString + '<unt>' + timeString + '</unt>' +
    '</estimatedOffBlockTime>' +
    '</flight:FlightPlanListRequest>';
    options.body = xmlString;
    request.post(options, function (err, res, body) {
        console.log(body);
    });
}

function flightListByAirspace(airspace, targetTimeInMss, windowWidthInMss) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightListByAirspaceRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
    '<endUserId>' + userId + '</endUserId>' +
    '<sendTime>' + timeString + '</sendTime>' +
    '<trafficType>DEMAND</trafficType>' +
    '<trafficWindow>';
    timeString = dateFormat(targetTimeInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<wef>' + timeString + '</wef>';
    timeString = dateFormat(targetTimeInMss + windowWidthInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<unt>' + timeString + '</unt>' +
    '</trafficWindow>' +
    '<airspace>' + airspace + '</airspace>' +
    '</flight:FlightListByAirspaceRequest>';
    options.body = xmlString;
    request.post(options, function (err, res, body) {
        console.log(body);
    });
}

function flightListByKeys(arcid, targetTimeInMss, windowWidthInMss) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightListByKeysRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
    '<endUserId>' + userId + '</endUserId>' +
    '<sendTime>' + timeString + '</sendTime>' +
    '<trafficType>DEMAND</trafficType>' +
    '<trafficWindow>';
    timeString = dateFormat(targetTimeInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<wef>' + timeString + '</wef>';
    timeString = dateFormat(targetTimeInMss + windowWidthInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<unt>' + timeString + '</unt>' +
    '</trafficWindow>' +
    '<aircraftId>' + arcid + '</aircraftId>' +
    '<nonICAOAerodromeOfDeparture>true</nonICAOAerodromeOfDeparture>' +
    '<airFiled>false</airFiled>' +
    '<nonICAOAerodromeOfDestination>true</nonICAOAerodromeOfDestination>' +
    '</flight:FlightListByKeysRequest>';
    options.body = xmlString;
    request.post(options, function (err, res, body) {
        console.log(body);
    });
}

function flightListByAerodromeRequest(trafficVolume, targetTimeInMss, windowWidthInMss) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightListByAerodromeRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
    '<endUserId>' + userId + '</endUserId>' +
    '<sendTime>' + timeString + '</sendTime>' +
    '<trafficType>DEMAND</trafficType>' +
    '<trafficWindow>';
    timeString = dateFormat(targetTimeInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<wef>' + timeString + '</wef>';
    timeString = dateFormat(targetTimeInMss + windowWidthInMss, "yyyy-mm-dd HH:MM");
    xmlString = xmlString + '<unt>' + timeString + '</unt>' +
    '</trafficWindow>' +
    '<aerodrome>' + trafficVolume + '</aerodrome>' +
    '<aerodromeRole>BOTH</aerodromeRole>' +
    '</flight:FlightListByAerodromeRequest>';
    options.body = xmlString;
    request.post(options, function (err, res, body) {
        console.log(body);
    });
};

function getXmlFlightRetrievalRequest(arcId, adep, ades, blockTime) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightRetrievalRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
        '<endUserId>' + userId + '</endUserId>' +
        '<sendTime>' + timeString + '</sendTime>' +
        '<flightId>' +
        '<keys>' +
        '<aircraftId>' + arcId + '</aircraftId>' +
        '<aerodromeOfDeparture>' + adep + '</aerodromeOfDeparture>' +
        '<nonICAOAerodromeOfDeparture>false</nonICAOAerodromeOfDeparture>' +
        '<airFiled>false</airFiled>' +
        '<aerodromeOfDestination>' + ades + '</aerodromeOfDestination>' +
        '<nonICAOAerodromeOfDestination>false</nonICAOAerodromeOfDestination>' +
        '<estimatedOffBlockTime>' + blockTime + '</estimatedOffBlockTime>' +
        '</keys>' +
        '</flightId>' +
        '<requestedFlightDatasets>flight</requestedFlightDatasets>' +
        '<requestedFlightFields>icaoRoute</requestedFlightFields>' +
        '</flight:FlightRetrievalRequest>';
    return xmlString;
};

function getXmlFlightPlanListRequest(arcId) {
};

String.prototype.flightPlanListRequest = function (callback) {
    var now = new Date();
    var timeString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var xmlString = '<flight:FlightPlanListRequest xmlns:flight="eurocontrol/cfmu/b2b/FlightServices" xmlns:common="eurocontrol/cfmu/b2b/CommonServices" xmlns:airspace="eurocontrol/cfmu/b2b/AirspaceServices" xmlns:flow="eurocontrol/cfmu/b2b/FlowServices">' +
    '<endUserId>' + userId + '</endUserId>' +
    '<sendTime>' + timeString + '</sendTime>' +
    '<aircraftId>' + this + '</aircraftId>' + 
    '<nonICAOAerodromeOfDeparture>false</nonICAOAerodromeOfDeparture>' +
    '<airFiled>false</airFiled>' +
    '<nonICAOAerodromeOfDestination>false</nonICAOAerodromeOfDestination>' +
    '<estimatedOffBlockTime>';
    timeString = dateFormat(now, "yyyy-mm-dd") + " 00:00";
    xmlString = xmlString + '<wef>' + timeString + '</wef>';
    timeString = dateFormat(now, "yyyy-mm-dd") + " 23:59";
    xmlString = xmlString + '<unt>' + timeString + '</unt>' +
    '</estimatedOffBlockTime>' +
    '</flight:FlightPlanListRequest>';
    options.body = xmlString;
    request.post(options, function (err, res, body) {
        xml2js.parseString(body, { trim: true, explicitArray : false }, function (err, result) {
            var datas = result['flight:FlightPlanListReply']['data'];
            console.log("B2BParser : " + datas);
            if (datas == '') {
                return callback("Vol inconnu");
            }
            datas = result['flight:FlightPlanListReply']['data']['summaries']['lastValidFlightPlanId']['keys'];
            xmlString = getXmlFlightRetrievalRequest(datas['aircraftId'],datas['aerodromeOfDeparture'], datas['aerodromeOfDestination'], datas['estimatedOffBlockTime']);
            options.body = xmlString;
            request.post(options, function (err, res, body) {
                console.log("B2BParser : " + body);
                return callback(body);
            });
        });
    });
}

function loadXMLDoc(filePath) {
    var xml2js = require('xml2js');
    var json;
    try {
        var fileData = fs.readFileSync(filePath, 'ascii');
        var parser = new xml2js.Parser({ explicitArray : false });
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            json = JSON.stringify(result,null,'\t');
            fs.writeFile('./json/flightDatas.json', json);
        });
    return json;
    } catch (ex) { console.log(ex) }
} 

exports.flightDatas = function (arcidId, callback) {
    arcidId.flightPlanListRequest(function (response) {
        return callback(response);
    });
}

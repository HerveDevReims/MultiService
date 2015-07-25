// déclaration du tableau des positions;
var configSalle = require('./json/configSalle.json');
var nomRegroupement = require('./json/nomRegroupement.json');
var fs = require('fs');
var http = require('http');

var b2b = require('./js/b2bParser');


var httpServer = http.createServer(function (req, res) {
    console.log('Un utilisateur a affiché la page.');
    res.end('Bonjour');
});

httpServer.listen(8888);
var io = require('socket.io').listen(httpServer);

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

io.sockets.on('connection', function (socket) {
    var me;
    var sectors;
    console.log('Nouvel utilisateur');
    
    socket.on('login', function (user) {
        console.log(user.username);
        me = user;
        sectors = configSalle[user.username];
        console.log(sectors);
        console.log(configSalle[user.username].status);
        socket.emit('confChange', configSalle);
    });

    socket.on('confChange', function (entry) {
        console.log('Requête confChange : ' + entry);
        if (isJsonString(entry)) {
            // entry est de type json object            
            var myJson = JSON.parse(entry);
            // on commence par traiter les fichier de modifications
            for (var key in myJson) {
                console.log(key);
                if (configSalle.hasOwnProperty(key)) {
                    var data = myJson[key];
                    // le secteur nommé 'key' existe dans la configuration de la salle
                    if (data.hasOwnProperty('sectors')) {
                        if (data.sectors.length === 0) {
                            configSalle[key].status = 'closed';
                            configSalle[key].busy = 'no';
                            configSalle[key].sectors = [];
                            configSalle[key].regroupement = ''
                        } else {
                            configSalle[key].status = 'open';
                            configSalle[key].sectors = data.sectors;
                            configSalle[key].regroupement = getCombinedSectorName(data.sectors)
                        }
                    } else {
                        // il n'y a pas de propriété 'sectors' dans le secteur, on le considère fermé
                        configSalle[key].status = 'closed';
                        configSalle[key].busy = 'no';
                        configSalle[key].sectors = [];
                        configSalle[key].regroupement = ''
                    }
                } else {
                    // la clé passée dans la fonction n'existe pas
                    console.log('confChange : impossible de traiter la clé : ' + key);
                }
            };
            fs.writeFile('./json/configSalle.json', JSON.stringify(configSalle, null, '\t'));
            io.sockets.emit('confChange', configSalle);
        } else {
            console.log("confChange : l'entry n'est pas au format JSON");
        };
    });

    socket.on('busyChange', function (entry) {
        configSalle[entry].busy = (configSalle[entry].busy === 'very' ? 'no' : 'very');
        console.log('La position ' + entry + ' est maintenant ' + configSalle[entry].busy);
        fs.writeFile('./json/configSalle.json', JSON.stringify(configSalle, null, '\t'));
        io.sockets.emit('confChange', configSalle);
    });

    socket.on('requestArcid', function (entry) {
        console.log('Requête ARCID(' + entry + ') reçue de ' + me.username);
        b2b.flightDatas(entry, function (result) {
            fs.writeFile(entry + ".xml", result, function (err) {
                if (err) {return console.log(err); }
            });
            console.log(result);
            socket.emit('reponseArcid', result);
        });
    });

});

function getCombinedSectorName(listOfSectors) {
    var combinedName = '';
    if (listOfSectors.length > 0) {
        var combinationSectorList = [];
        for (combinationName in nomRegroupement) {
            var combinationSectorList = nomRegroupement[combinationName]["sectors"];
            // on vérifie que le nombre de secteurs dans la liste est le même que celui en mémoire
            if (listOfSectors.length === combinationSectorList.length) {
                var nbMatch = 0;
                listOfSectors.forEach(function (item) {
                    if (combinationSectorList.indexOf(item) >= 0) { nbMatch += 1 }
                });
                if (nbMatch === listOfSectors.length) { combinedName = combinationName }
            }
        }
    };
    return combinedName;
}

function getTvName(combinedName) {
    var tvName = "???";
    for (combinationName in nomRegroupement) {
        if (combinationName == combinedName) {
            return nomRegroupement[tvName];
        }
    };
    return tvName;
}

var Name = getCombinedSectorName(["XH", "UH", "KH"]);
var tvName = getTvName("UXKH");
console.log("Nom du regroupement : " + Name);
console.log("Nom du TV : " + tvName);

(function ($) {
    
    $('#clientusername').html(myusername);
    $('#positionstatus').html(myusername);
    var mySectors = [];
    var myCombinedName = '';
    
    var socket = io.connect('http://localhost:8888');
    
    socket.on('connect', function () {
        socket.emit('login', { username : myusername });
    });    
    
    socket.on('disconnect', function () {
        $('#offstatus').fadeIn();
    });

    socket.on('reponseArcid', function (jsonDatas) {
        //var flightDatas = $.parseJSON(jsonDatas);
        //var test = flightDatas['flight:FlightRetrievalReply']['data']['flightPlan']['icaoRoute'];
        //$('#arcidResponse').html(test);
        $('#arcidResponse').html(jsonDatas);
        $('#arcidResponseMask').fadeOut();
    });    
    
    socket.on('confChange', function (entry) {
        mySectors = [];
        var myOwnSecteurs = '';
        var myBusySecteurs = '';
        $.each(entry, function (key, data) {
            if (key === myusername) {
                // on traite l'affichage des données propres à notre position
                var mycolor = '#dddddd';
                switch (data.busy) {
                    case 'very':
                        mycolor = '#dd1111';
                        break;
                    default:
                        mycolor = '#dddddd';
                }
                $('#positionstatus').css('background-color', mycolor);
                data.sectors.forEach(function (data) {
                    myOwnSecteurs += data + " ";
                    mySectors.push(data);
                });
                (data.status === 'closed' ?  $('#offstatus').fadeIn() : $('#offstatus').fadeOut());
                myCombinedName = data.regroupement;
            } else {
                if (data.busy === 'very') {
                    data.sectors.forEach(function (data) {
                        myBusySecteurs += data + " ";
                    });
                }
            }
        });
        $('#positionsecteur').html(myCombinedName.trim());
        $('#busysecteur').html(myBusySecteurs.trim().replace(/ /g, ' / '));
    });

    $('#positionstatus').click(function () {
        socket.emit('busyChange', myusername);
    });

    $('#submitRequest').click(function () {
        $('arcidResponseMask').fadeIn();
        socket.emit('requestArcid', $('#arcidId').val());
    });

})(jQuery);

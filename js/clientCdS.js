(function ($) {
    
    var myusername = "CdS";
    var socket = io.connect('http://localhost:8888');
    
    socket.on('connect', function () {
        socket.emit('login', { username : myusername });
    });    
    
    socket.on('openposition', function () {
        $('#offstatus').fadeOut();
    });
    
    socket.on('closeposition', function () {
        $('#offstatus').fadeIn();
    });

    socket.on('disconnect', function () {
        $('#offstatus').fadeIn();
    });

    socket.on('confChange', function (entry) {
        // Réception d'une modification de configuration de salle
        $.each(entry, function (key, data) {
            if (key === 'CdS') {
                (data.status === 'closed' ? $('#offstatus').fadeIn() : $('#offstatus').fadeOut());
            }
            myButton = $('#switch_' + key);
            if (myButton.length) {
                myButton.css('background-color', (data.status === 'closed' ? '#dddddd' : (data.busy=== 'very' ? '#e11' : '#1e1')));
            }
        });
    });
    
    $('.confChangeButton').click(function () {
        var arrayId = $(this).attr('id').split('_');
        var jsonObj = JSON.stringify(
            new function () { this[arrayId[1]] = { "sectors": ["UE", "KE", "XE", "HE"] }
            });
        socket.emit('confChange', jsonObj)
    });

})(jQuery);


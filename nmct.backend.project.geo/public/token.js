/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side
 =============================================================================*/
var token, socket;
function connect() {
    socket = io.connect(token ? ('?token=' + token) : '', {
        'forceNew': true
    });
    socket.on('time', function (data) {
        console.log('- broadcast: ' + data);
    }).on('authenticated', function () {
        console.log('- authenticated');
    }).on('disconnect', function () {
        console.log('- disconnected');
    });
    //.on("add-share", function(share) {
        // TODO: Add share to map
    //};
}
connect(); //connect now, it will drop

$('#login').submit(function (e) {
    e.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    $.ajax({
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        url: '../login'
    }).done(function (result) {
        token = result.token;
        connect();
    });

});
$("#locations").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        data: {
            token: token
        },
        url: "../add-share"
    }).done(function (result) {
        console.log(result)
    });
    //socket.emit("add-share", {share-data});
});
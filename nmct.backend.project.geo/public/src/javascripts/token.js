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
    }).on("addshare", function(share) {
        // TODO: Add share to map
        console.log("- add share to map");
    }).on("unauthorized", function (error) { 
        console.log("- unauthorized");
    });
} function connectAnonymous() {
    $.ajax({
        type: 'POST',
        data: {
            username: "anonymous",
            password: 123
        },
        url: '../login'
    }).done(function (result) {
        token = result.token;
        connect();
    });
}


connect(); //connect now, it will drop
connectAnonymous();

$('#login').submit(function (e) {
    e.preventDefault();
    var username = $('#exampleInputEmail1').val();
    var password = $('#exampleInputPassword1').val();

    // TODO: get new token and reconnect
});
$("#add-share").submit(function (e) {
    socket.emit("addshare", { error: null, share: "test-share", token: token });   
});
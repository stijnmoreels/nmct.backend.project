/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side (Sockets & Login Post)
 =============================================================================*/

var token, socket;
function setupSockets() {
    socket = io.connect(token ? ('?token=' + token) : '', {
        'forceNew': true
    });
    socket.on('time', function (data) {
        console.log('- broadcast: ' + data);
    }).on('authenticated', function () {
        console.log('- authenticated');
    }).on('disconnect', function () {
        console.log('- disconnected');
    }).on("addshare", function (share) {
        // TODO: Add share to map
        console.log("- add share to map");
    }).on("shares", function (shares) {
        console.log("- get shares: " + shares[0].feeling);
    }).on("unauthorized", function (error) {
        console.log("- unauthorized");
    });
} function connectAnonymous() {
    post("anonymous", 123);
} $('#login').submit(function (e) {
    e.preventDefault();
    var username = $('#exampleInputEmail1').val();
    var password = $('#exampleInputPassword1').val();
    post(username, password);
}); function post(username, password) {
    $.ajax({
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        url: '../login'
    }).done(function (result) {
        token = result.token;
        setupSockets();
        readShares();
    });
} function readShares() {
    socket.emit("shares");
}

//setupSockets(); //connect now, it will drop
connectAnonymous(); //connect as anonymous

$("#add-share").submit(function (e) {
    socket.emit("addshare", { error: null, share: "test-share", token: token });
});
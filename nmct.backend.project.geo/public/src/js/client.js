/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side (Sockets & Login Post)
 =============================================================================*/

var client = (function () {
    var token, socket, callbackAddShare, callbackAddActivity;
    var setupSockets = function () {
        socket = io.connect(token ? ('?token=' + token) : '', {
            'forceNew': true
        });
        socket.on('time', function (data) {
            console.log('- broadcast: ' + data);
        }).on('authenticated', function () {
            console.log('- authenticated');
        }).on('disconnect', function () {
            console.log('- disconnected');
        }).on("unauthorized", function (error) {
            console.log("- unauthorized");
        }).on("addshare", function (created) {
            if (callbackAddShare != null)
                callbackAddShare(null, created);
        }).on("addactivity", function (created) { 
            if (callbackAddActivity != null)
                callbackAddActivity(null, created);
        });
    }, connectAnonymous = function (callback) {
            post("anonymous", 123, callback);
        }, post = function (username, password, callback) {
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
                callback(null, result.user);
            });
        }, login = function (username, password, callback) {
            post(username, password, callback);
        }, getShares = function (callback) {
            socket.on("shares", function (shares) {
                callback(null, shares);
            });
            socket.emit("shares", null);
        }, addShare = function (share, callback) {
            var object = { error: null, share: share, token: token };
            if (callback != null)
                callbackAddShare = callback;
            socket.emit("addshare", object);
        }, addActivity = function (activity, callback) {
            var object = { error: null, activity: activity, token: token };
            if (callback != null)
                callbackAddActivity = callback;
            socket.emit("addactivity", object);
        }, addShareOrActivity = function (element, callback) {
            if (element.isActivity) {
                addActivity(element, callback);
            } else {
                addShare(element, callback);
            }
        };
    return {
        login: login,
        connectAnonymous: connectAnonymous,
        getShares: getShares,
        addShareOrActivity: addShareOrActivity,
        standardCallbackAddShare: callbackAddShare,
        standardCallbackAddActivity: callbackAddActivity
        //TODO: register, 
    };
})();
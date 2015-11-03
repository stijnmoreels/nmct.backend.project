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
        }).on("register", function (user) {
            console.log("- register");
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
        }, register = function (name, firstname, username, password, callback) { 
            var user = { id: username, name: name, firstname: firstname, username: username, password: password }
            socket.emit("register", { error: null, user: user, token: token });
            callback(null, user);
        }, getShares = function (callback) {
            socket.on("shares", function (shares) {
                callback(null, shares);
            });
            socket.emit("shares", null);
        }, getActivities = function (callback) {
            socket.on("activities", function (activities) { 
                callback(null, activities);
            });
            socket.emit("activities", null);
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
        register: register,
        connectAnonymous: connectAnonymous,
        getShares: getShares,
        getActivities: getActivities,
        sendShareOrActivity: addShareOrActivity,
        receiveAddShare: callbackAddShare,
        receiveAddActivity: callbackAddActivity
    };
})();
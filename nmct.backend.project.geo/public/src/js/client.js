/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side (Sockets & Login Post)
 =============================================================================*/

var client = (function () {
    var token, socket, callbackAddShare, callbackAddActivity, challenge;
    var setupSockets = function () {
        socket = io.connect(token ? ('?token=' + token) : '', {
            'forceNew': true
        });
        
        // Socket registration
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
            //if (callbackAddShare != null)
            //    callbackAddShare(null, created);
            addShareToMap(null, created);
        }).on("addactivity", function (created) {
            //if (callbackAddActivity != null)
            //    callbackAddActivity(null, created);
            addActivityToMap(null, created);
        }).on("challenge", function (challenge) {
            console.log(challenge);
        }).on("error", function (error) { 
            console.log("Socket error: " + error);
        });
    },  
    // Connect Anonymous is needed for everyone to see the shares/activities
        connectAnonymous = function (callback) {
            post("anonymous", Sha1.hash("123"), callback);
        }, post = function (username, password, callback) {
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                data: {
                    username: username,
                    password: password
                },
                url: '../login'
            }).done(function (result) {
                if (result.error) { callback(result.error, null); }
                else if (result.token) {
                    token = result.token;
                    localStorage.token = token;
                    setupSockets();
                    callback(null, result.user);
                } else callback("Unhandeld error", null);
            });
        }, 
        // Login method
        login = function (username, password, callback) {
            post(username, Sha1.hash(password.toString()), callback);
        }, 
        // Register method
        register = function (name, firstname, username, password, callback) {
            var user = { id: username, name: name, firstname: firstname, username: username, password: Sha1.hash(password + "") }
            if (user.id == null || user.id === "")
                callback("Error: 'id' is missing", null);
            else {
            socket.emit("register", { error: null, user: user, token: token == null ? localStorage.token : token });
                callback(null, user);
            }
        }, 
        // Get all shares
        getShares = function (callback) {
            socket.on("shares", function (shares) {
                if (shares)
                    callback(null, shares);
                else callback("no shares", null);
            });
            socket.emit("shares", null);
        }, 
        // Get all activities
        getActivities = function (callback) {
            socket.on("activities", function (activities) {
                if (activities)
                    callback(null, activities);
                else callback("no activities", null);
            });
            socket.emit("activities", null);
        }, 
        // Add a new share
        addShare = function (share, callback) {
            var object = { error: null, share: share, token: token == null ? localStorage.token : token };
            //if (callback != null)
            //    callbackAddShare = callback;
            if (share.id == null || share.id === "")
                callback("Error: 'id' is missing", null);
            else {
            socket.emit("addshare", object);
                callback(null, object);
            }
        }, 
        // Add a new activity
        addActivity = function (activity, callback) {
            var object = { error: null, activity: activity, token: token == null ? localStorage.token : token };
            //if (callback != null)
            //    callbackAddActivity = callback;
            if (activity.id == null || activity.id === "")
                callback("Error: 'id' is missing", null);
            else {
                socket.emit("addactivity", object);
                callback(null, object);
            }
        };
    
    // Public methods
    return {
        login: login,
        register: register,
        connectAnonymous: connectAnonymous,
        getShares: getShares,
        getActivities: getActivities,
        addShare: addShare,
        addActivity: addActivity,
        receiveAddShare: callbackAddShare,
        receiveAddActivity: callbackAddActivity
    };
})();
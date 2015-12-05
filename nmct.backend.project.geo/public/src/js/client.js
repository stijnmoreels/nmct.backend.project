/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side (Sockets & Login Post)
 =============================================================================*/

var client = (function () {
    "use-strict";
    var token, socket, callbackAddShare, callbackAddActivity, challenge;
    var setupSockets = function (user) {
        if (socket != null) {
            // disconnect a current connected client
            // -> to make sure we only have ONE connected socket/client
            socket.disconnect();
        }
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
            // Add share to Maps
            addShareToMap(null, created);
        }).on("addactivity", function (created) {
            // Add activity to Maps
            addActivityToMap(null, created);
        }).on("newuser", function (data) {
            // Show new online user
            addUserToOnlineUsers(null, { username: data.user, socketId: data.socketId });
            console.log("- new user: " + data.user + ", socketId: " + data.socketId);
        }).on("deleteuser", function (data) { 
            // Delete online user
            deleteUserToOnlineusers(null, data.socketId);
            console.log("- delete user: " + data.socketId);
        }).on("message", function (message) {
            // TODO: show to frontend
            
            console.log("- message: " + message);
        }).on("challenge", function (challenge) {
            console.log(challenge);
        }).on("error", function (error) {
            console.log("- Socket error: " + error);
        });
        
        // inform other connected clients that there's a new user connected
        if (user.isAvailable)
            socket.emit("newuser", user);
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
                    setupSockets(result.user);
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
        // Get all shares that are signed to an Activity
        getSignedShares = function (callback) {
            socket.on("signedshares", function (shares) {
                if (shares)
                    callback(null, shares);
                else callback("no shares", null);
            });
            socket.emit("signedshares", null);
        },
        // Get all unsigned shares 
        getUnsignedShares = function (callback) {
            socket.on("unsignedshares", function (shares) {
                if (shares)
                    callback(null, shares);
                else callback("no shares", null);
            });
            socket.emit("unsingedshares", null);
        },
        // Get shares generic
        getGenericShares = function (subscription, callback) {
            socket.on(subscription, function (shares) { 
                if (shares)
                    callback(null, shares);
                else callback("no shares", null);
            });
            socket.emit(subscription, null);
        },
        // Get all shares for a given "activityId"
        getSharesForActivity = function (activityId, callback) {
            socket.on("sharesactivity", function (shares) {
                if (shares)
                    callback(null, shares);
                else callback("no shares", null);
            });
            socket.emit("sharesactivity", null);
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
            if (activity.id == null || activity.id === "")
                callback("Error: 'id' is missing", null);
            else {
                socket.emit("addactivity", object);
                callback(null, object);
            }
        }, sendMessage = function (message, socketId, callback) {
            socket.emit("message", { message: message, socketId: socketId });
            callback(null, "message send");
        };
    
    // Public methods
    return {
        login: login,
        register: register,
        connectAnonymous: connectAnonymous,
        getShares: getShares,
        getSignedShares: getSignedShares,
        getSharesForActivity: getSharesForActivity,
        getGenericShares: getGenericShares,
        getActivities: getActivities,
        addShare: addShare,
        addActivity: addActivity,
        receiveAddShare: callbackAddShare,
        receiveAddActivity: callbackAddActivity,
        sendMessage: sendMessage
    };
})();
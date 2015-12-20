/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Client Side (Sockets & Login Post)
 =============================================================================*/

var client = (function () {
    "use-strict";
    var token, socket, callbackAddShare, callbackAddActivity, challenge, isAdmin;
    var setupSockets = function (user) {
        if (socket !== undefined) {
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
        
        // Geofeelings registration
        }).on("addshare", function (created) {
            // Add share to Maps
            addShareToMap(null, created);
        }).on("addactivity", function (created) {
            // Add activity to Maps
            addActivityToMap(null, created);
        }).on("deleteactivity", function (activityId) {
            // Delete activity on Map (deleted by an Admin)
            deleteActivityFromMap(null, activityId);

        // User registration
        }).on("newuser", function (data) {
            // Show new online user
            if (localStorage.isAvailable) {
                chat.addUser(null, data);
                console.log("- new user: " + data);
            }
        }).on("users", function (users) {
            // Add all current online users to the chatbox
            if (localStorage.isAvailable) {
                for (var i = 0, l = users.length; i < l; i++) {
                    chat.addUser(null, users[i]);
                }
            }
        }).on("deleteuser", function (data) {
            // Delete online user
            if (localStorage.isAvailable) {
                chat.deleteUser(null, data.username);
                console.log("- delete user: " + data.username);
            }
        }).on("message", function (data) {
            // TODO: show to frontend
            
            chat.messages[data.username].chatPartner.push(data.message);
            chat.addMessageToChat(data.username);
            console.log("- message: " + data.message);

        // Extra registration
        }).on("challenge", function (challenge) {
            console.log(challenge);
        }).on("error", function (error) {
            console.log("- Socket error: " + error);
        });
        
        client.isAdmin = user.isAdmin;
        // inform other connected clients that there's a new user connected
        if (user.isAvailable) {
            socket.emit("newuser", user);
            socket.emit("users", null);
        }
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
                    // Token returned = login succeeded
                    token = result.token;
                    localStorage.token = token;
                    localStorage.isAvailable = result.user.isAvailable; // chatbox
                    localStorage.hash = result.user.password;
                    localStorage.username = result.user.username;
                    setupSockets(result.user);
                    callback(null, result.user);
                } else callback("Unhandeld error", null);
            });
        }, 
        // Login method
        login = function (username, password, callback) {
            post(username, Sha1.hash(password.toString()), callback);
        },
        // Remember me login method
        rememberMeLogin = function (username, password, callback) {
            post(username, password, callback);
        }
    // Register method
    register = function (name, firstname, username, password, isAvailable, callback) {
        var user = { id: username, name: name, firstname: firstname, username: username, password: Sha1.hash(password + ""), isAvailable: isAvailable };
        if (user.id === null || user.id === "")
            callback("Error: 'id' is missing", null);
        else {
            socket.emit("register", { error: null, user: user, token: token === null ? localStorage.token : token });
            callback(null, user);
        }
    }, 
        // Get all generic
        getAllGeneric = function (subscription, callback) {
        socket.on(subscription, function (shares) {
            if (shares)
                callback(null, shares);
            else callback("no " + subscription + " found", null);
        });
        socket.emit(subscription, null);
    },
        // Add a new share
        addShare = function (share, callback) {
        if (localStorage.username === "anonymous")
            callback("Unauthorized", null);
        var object = { error: null, share: share, token: token === null ? localStorage.token : token };
        if (share.id === null || share.id === "")
            callback("Error: 'id' is missing", null);
        else {
            socket.emit("addshare", object);
            callback(null, object);
        }
    }, 
        // Add a new activity
        addActivity = function (activity, callback) {
        if (localStorage.username === "anonymous")
            callback("Unauthorized", null);
        var object = { error: null, activity: activity, token: token === null ? localStorage.token : token };
        if (activity.id === null || activity.id === "")
            callback("Error: 'id' is missing", null);
        else {
            socket.emit("addactivity", object);
            callback(null, object);
        }
    },
        // Send message to a single connected client (socket)
        sendMessage = function (message, username, callback) {
        socket.emit("message", { message: message, username: username });
        callback(null, "message send");
    },
        // (Only Admin) Delete activity
        deleteActivity = function (activityId, callback) {
        if (activityId) {
            socket.emit("deleteactivity", { error: null, activityId: activityId, token: token === null ? localStorage.token : token });
            callback(null, activityId);
        } else callback("no 'id' found in activityId", null);
    };
    
    // Public methods
    return {
        login: login,
        rememberMeLogin: rememberMeLogin,
        register: register,
        connectAnonymous: connectAnonymous,
        getAllGeneric: getAllGeneric, // users, shares, unsignedshares, signedshares & sharesactivity
        addShare: addShare,
        addActivity: addActivity,
        deleteActivity: deleteActivity,
        sendMessage: sendMessage,
        isAdmin: isAdmin
    };
})();
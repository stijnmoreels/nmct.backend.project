/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side Sockets
 =============================================================================*/

var Communication = (function () {
    "use-strict";
    var jwt = require('jsonwebtoken'),
        jwt_secret = require("../config/configuration.js").jwt_secret,
        socketIo = require("socket.io"),
        socketio_jwt = require('socketio-jwt'),
        logger = require("../logger/socket-logger.js"),
        sio = "",
        Share = require("../model/share.js"),
        DocumentDB = require("../database/documentdb.js"),
        repository = require("../repository/generic.js"),
        sh1 = require("../crypto/hash.js");
    
    var listen = function (server) {
        var clients = [];
        sio = socketIo.listen(server);
        sio.use(logger);
        authorize();
        sio.sockets.on('connection', connection);
        
        // Connection Callback
        function connection(socket) {
            console.log("connected: " + socket.id);
            
            socket.on("disconnect", function () {
                console.log("disconnected: " + socket.id);
                socket.disconnect();
                sio.sockets.emit("deleteuser", socket.username);
            });
            
            // inform other users that there's a new user connected
            socket.on("newuser", function (user) {
                // if the user don't want to chat with anyone (Registration)
                if (user.isAvailable) {
                    //clients.push({ username: user.username, socketId: socket.id });
                    socket.username = user.username;
                    clients[user.username] = socket;
                    sio.sockets.emit("newuser", user.username);
                }
            });
            
            // get all current online users (sockets)
            socket.on("users", function () {
                sio.emit("users", Object.keys(clients));
            });
            
            // chat functionality (send only to one client)
            socket.on("message", function (data) {
                partnerSocket = clients[data.username];
                partnerSocket.emit("message", data.message);
            });
            
            // user adds share to map
            socket.on("addshare", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Anonymous has no rights to add shares/activities
                    if (user[0].username === "anonymous" || user[0].password === 123)
                        sio.emit("unauthorized", "Must login to add a share");
                    // Get correct user (dubble check)
                    else repository.getOne(user[0], "users", userExistsCallback);
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                        // (user exists) -> check if this user has already a share in this activity
                    else repository.getOne({ username: user[0].username, activityId: data.share.activityId }, 
                            "shares", queryDocumentsCallback);
                }
                // callback that checks for the single or multiple shares
                function queryDocumentsCallback(error, shares) {
                    if (error) { throw error; }
                    
                    // only add a share if the user hasn't add a share in the past
                    /* if (shares == null || shares == undefined || shares.length == 0) {*/
                    if (true) {
                        data.share.isActivity = false; // we use the same document list
                        repository.insertOne(data.share, "shares", function (error, document) {
                            if (error) { sio.emit("error", "Insert share failed"); throw error; }
                            sio.sockets.emit("addshare", document); //-> maybe?
                        });

                    } else if (shares.length > 0)
                        // send default error message back to client
                        sio.emit("error", "Insert share failed");
                }
            });
            
            // user adds activity to map
            socket.on("addactivity", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Anonymous has no rights to add shares/activities
                    if (user.username === "anonymous" || user.password === 123)
                        sio.emit("unauthorized", "Must login to add a share");
                    else repository.getOne(user[0], "users", userExistsCallback);
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        data.activity.isActivity = true; // we use the same document list
                        repository.insertOne(data.activity, "shares", function (error, document) {
                            if (error) { sio.emit("error", "Insert activity failed"); throw error; }
                            sio.sockets.emit("addactivity", document);
                        });
                    }
                }
            });
            
            // delete activity in the database
            socket.on("deleteactivity", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Only the Admins have the rights to delete activities
                    if (user.username === "anonymous" || user.password === 123 || user.isAdmin === false)
                        sio.emit("unauthorized", "You have no rights to delete a Activity");
                    else repository.getOne(user[0], "users", userExistsCallback);
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    // user exists
                    else {
                        if (data.activityId !== undefined)
                            repository.deleteOne(data.activityId, "shares", deleteDocumentCallback);
                        else sio.emit("error", "Delete activity failed");
                    }
                } function deleteDocumentCallback(error, document) {
                    if (error) { throw error; }
                    else sio.sockets.emit("deleteactivity", data.activityId);
                }
            });
            
            // register users
            socket.on("register", function (data) {
                if (data.error) { throw error; }
                repository.insertOne(data.user, "users", function (error, user) {
                    if (error) { sio.emit("error", "Register user failed"); throw error; }
                    sio.emit("register", data.user);
                });
            });
            
            // user get all curent shares
            socket.on("shares", function () {
                repository.getAll("shares", function (error, shares) {
                    if (error) { sio.emit("error", "Get shares failed"); throw error; }
                    sio.emit("shares", shares);
                });
            });
            
            // get all shares that are signed to an Activity
            socket.on("signedshares", function () {
                repository.getAll("signedshares", function (error, shares) {
                    if (error) { sio.emit("error", "Get signed shares faild"); throw error; }
                    sio.emit("signedshares", shares);
                });
            });
            
            // get all unsigned shares
            socket.on("unsignedshares", function () {
                repository.getAll("unsignedshares", function (error, shares) {
                    if (error) { sio.emit("error", "Get unsigned shares faild"); throw error; }
                    sio.emit("unsignedshares", shares);
                });
            });
            
            // user get all curent activities
            socket.on("activities", function () {
                repository.getAll("activities", function (error, activities) {
                    if (error) { sio.emit("error", "Get activities failed"); throw error; }
                    sio.emit("activities", activities);
                });
            });
        }
        
        // authorize any socket communication
        function authorize() {
            sio.use(socketio_jwt.authorize({
                secret: jwt_secret,
                handshake: true
            }));
        }
    }, 
        // sign user, means he gets a token 
        sign = function (user, callback) {
            var token = jwt.sign(user, jwt_secret, { expiresIn: 60 * 5 }); // 5 min expiration time
            if (token) callback(null, token);
            else callback("error with token", null);
        }, 
        // get the user from the token
        decoded = function (object, callback) {
            var decoded = jwt.verify(object.token, jwt_secret, callback);
        };
    
    // public methods    
    return {
        listen: listen,
        sign: sign,
        verify: decoded
    };
})();

module.exports = Communication;
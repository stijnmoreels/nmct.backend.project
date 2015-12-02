/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side Sockets
 =============================================================================*/

var Communication = (function () {
    "use-strict";
    var jwt = require('jsonwebtoken'),
        jwt_secret = 'BRZ8gRtRzmNMcEzSfA6wq8zC3ACZGvuFKGHGaNw78DvTtX8azxRCfyWAEZUvwUKkP6sNFZxL5trJSLZ4FKt5Dyc46bRMzt4Z2UjsT4zUKseaN6hAgxQHaTzn',
        socketIo = require("socket.io"),
        socketio_jwt = require('socketio-jwt'),
        sio = "",
        Share = require("../model/share.js"),
        DocumentDB = require("../database/documentdb.js"),
        sh1 = require("../crypto/hash.js");
    
    var listen = function (server) {
        sio = socketIo.listen(server);
        authorize();
        sio.sockets.on('connection', connection);
        
        // Connection Callback
        function connection(socket) {
            console.log("connected: " + socket.id);
            
            socket.on("disconnect", function () {
                console.log("disconnected: " + socket.id);
                socket.disconnect();
            });

            // inform other users that there's a new user connected
            socket.on("newuser", function (user) {
                // if the user don't want to chat with anyone (Registration)
                if (user.isAvailable)
                    sio.sockets.emit("newuser", { user: user.username, socketId: socket.id });
            });
            
            // chat functionality (send only to one client)
            socket.on("message", function (data) {
                socket.to(data.socketId).emit("message", data.message);
            });
            
            // user adds share to map
            socket.on("addshare", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Anonymous has no rights to add shares/activities
                    if (user[0].username === "anonymous" || user[0].password === 123) {
                        sio.emit("unauthorized", "Must login to add a share");
                    } else {
                        userExists(user[0], userExistsCallback);
                    }
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        // check if this user has already a share in this activity
                        var query = "SELECT * FROM shares s WHERE s.isActivity=false AND s.author=@username AND s.activityId=@activityId";
                        var parameters = [{ name: "@username", value: user[0].username }, { name: "@activityId", value: data.share.activityId }];
                        DocumentDB.query("shares", { query: query, parameters: parameters }, queryDocumentsCallback);
                    }
                }
                // callback that checks for the single or multiple shares
                function queryDocumentsCallback(error, shares) {
                    if (error) { throw error; }
                    
                    // only add a share if the user hasn't add a share in the past
                    if (shares == null || shares == undefined || shares.length == 0) {
                        data.share.isActivity = false; // we use the same document list
                        DocumentDB.insert("shares", data.share, 
                            function (error, document) {
                            if (error) { throw error; sio.emit("error", "Insert share failed"); }
                            //sio.emit("addshare", document);
                            sio.sockets.emit("addshare", document); //-> maybe?
                        });
                    } else if (shares.length > 0) {
                        // send default error message back to client
                        sio.emit("error", "Insert share failed");
                    }
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
                    else userExists(user, userExistsCallback);
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        data.activity.isActivity = true; // we use the same document list
                        DocumentDB.insert("shares", data.activity, 
                            function (error, document) {
                            if (error) { throw error; sio.emit("error", "Insert activity failed"); }
                            sio.sockets.emit("addactivity", document);
                        });
                    }
                }
            });
            
            // TODO: admin has the authority to delete shares and activities
            socket.on("deleteactivity", function (data) {

            });
            
            // register users
            socket.on("register", function (data) {
                if (data.error) { throw error; }
                //data.user.password = sh1.hash(data.user.password);
                DocumentDB.insert("users", data.user, function (error, user) {
                    if (error) { throw error; sio.emit("error", "Register user failed"); }
                    sio.emit("register", data.user);
                });
            });
            
            // user get all curent shares
            socket.on("shares", function () {
                var query = { query: "SELECT * FROM shares s WHERE s.isActivity=false" };
                DocumentDB.query("shares", query, queryDocumentsCallback);
                function queryDocumentsCallback(error, shares) {
                    if (error) { throw error; sio.emit("error", "Get shares failed"); }
                    sio.emit("shares", shares);
                }
            });
            
            // get all shares that are signed to an Activity
            socket.on("signedshares", function () {
                var query = { query: "SELECT * FROM shares s WHERE s.isActivity=false AND s.activityId=0" };
                DocumentDB.query("shares", query, queryDocumentCallback);
                function queryDocumentCallback(error, shares) {
                    if (error) { throw error; sio.emit("error", "Get shares faild"); }
                    sio.emit(shares);
                }
            });
            
            // get all unsigned shares
            socket.on("unsignedshares", function () {
                // TODO: ...
            });
            
            // get all shares for activity
            socket.on("sharesactivity", function (activityId) {
                var query = "SELECT * FROM shares s WHERE s.isActivity=false AND s.activityId=@activityId";
                var parameters = [{ name: "@activityId", value: activityId + "" }];
                DocumentDB.query("shares", { query: query, parameters: parameters }, queryDocumentsCallback);
                function queryDocumentsCallback(error, shares) {
                    if (error) { throw error; sio.emit("error", "Get shares for activity failed"); }
                    sio.emit("sharesactivity", shares);
                }
            });
            
            // user get all curent activities
            socket.on("activities", function () {
                var query = { query: "SELECT * FROM shares s WHERE s.isActivity=true" };
                DocumentDB.query("shares", query, queryDocumentsCallback);
                function queryDocumentsCallback(error, activities) {
                    if (error) { throw error; sio.emit("error", "Get activities failed"); }
                    sio.emit("activities", activities);
                }
            });
            
            function userExists(user, callback) {
                //var password = sh1.hash(user.password);
                var query = "SELECT * FROM users u WHERE u.username=@username AND u.password=@password";
                var parameters = [{
                        name: "@username", value: user.username + ""
                    }, {
                        name: "@password", value: user.password + ""
                    }];
                DocumentDB.query("users", { query: query, parameters: parameters }, callback);
            }
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
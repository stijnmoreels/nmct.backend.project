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
            sio.emit("challenge", socket.id);

            // user adds share to map
            socket.on("addshare", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Anonymous has no rights to add shares/activities
                    if (user[0].username === "anonymous" || user.password === 123) {
                        sio.emit("unauthorized", "Must login to add a share");
                    } else {
                        userExists(user, userExistsCallback);
                    }
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        data.share.isActivity = false; // we use the same document list
                        DocumentDB.insert("shares", data.share, 
                            function (error, document) {
                            if (error) { throw error; sio.emit("error", "Insert share failed"); }
                            sio.emit("addshare", document);
                            // sio.sockets.emit(); -> maybe?
                        });
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
                    else
                        userExists(user, userExistsCallback);
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        data.activity.isActivity = true; // we use the same document list
                        DocumentDB.insert("shares", data.activity, 
                            function (error, document) {
                            if (error) { throw error; sio.emit("error", "Insert activity failed"); }
                            sio.emit("addactivity", document);
                        });
                    }
                }
            });
            
            // TODO: admin has the authority to delete shares and activities

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
            if (token)
                callback(null, token);
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
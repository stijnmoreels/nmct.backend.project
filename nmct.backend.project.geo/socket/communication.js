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
            
            //socket.on("disconnect", function () {
            //    console.log("disconnect");
            //});

            // user adds share to map
            socket.on("addshare", function (data) {
                if (data.error) { throw error; }
                jwt.verify(data.token, jwt_secret, getDecoded);
                // Get verified by JsonWebToken
                function getDecoded(error, user) {
                    if (error) { throw error; }
                    // Anonymous has no rights to add shares/activities
                    if (user.username === "anonymous" || user.password === 123) {
                        sio.emit("unauthorized", "Must login to add a share");
                    } else {
                        userExists(user, userExistsCallback);
                    }
                } function userExistsCallback(error, user) {
                    if (error) { throw error; }
                    else {
                        // user exists
                        DocumentDB.insert("shares", data.element, 
                            function (error, document) {
                            sio.emit("addshare", document);
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
                        DocumentDB.insert("activities", data.element, 
                            function (error, document) {
                            sio.emit("addactivity", document);
                        });
                    }
                }
            });
            
            socket.on("register", function (data) {
                if (data.error) { throw error; }
                //data.user.password = sh1.hash(data.user.password);
                DocumentDB.insert("users", data.user, function (error, user) {
                    sio.emit("register", data.user);
                });
            });
            // user get all curent shares
            socket.on("shares", function () {
                var query = { query: "SELECT * FROM shares" };
                DocumentDB.query("shares", query, queryDocumentsCallback);
                function queryDocumentsCallback(error, shares) {
                    sio.emit("shares", shares);
                }
            });
            // user get all curent activities
            socket.on("activities", function () {
                var query = { query: "SELECT * FROM activities" };
                DocumentDB.query("activities", query, queryDocumentsCallback);
                function queryDocumentsCallback(error, activities) {
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
                documentDb.query("users", { query: query, parameters: parameters }, callback);
            }
        } function authorize() {
            sio.use(socketio_jwt.authorize({
                secret: jwt_secret,
                handshake: true
            }));
        }
    }, 
        // sign user, means he gets a token 
        sign = function (user, callback) {
            var token = jwt.sign(user, jwt_secret, { expiresIn: 60 * 5 }); // 5 min
            callback(null, token);
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
/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side Sockets
 =============================================================================*/
var Communication = (function () {
    var jwt = require('jsonwebtoken'),
        jwt_secret = 'BRZ8gRtRzmNMcEzSfA6wq8zC3ACZGvuFKGHGaNw78DvTtX8azxRCfyWAEZUvwUKkP6sNFZxL5trJSLZ4FKt5Dyc46bRMzt4Z2UjsT4zUKseaN6hAgxQHaTzn',
        socketIo = require('socket.io'),
        socketio_jwt = require('socketio-jwt'),
        sio = "",
        crypt = require('../crypto/encrypt.js');
    var listen = function (server) {
        sio = socketIo.listen(server);
        authorize();
        sio.sockets
        .on('connection', function (socket) {
            //console.log(socket.decoded_token.email, 'connected');
            socket.on("addshare", function (data) {
                if (data.error) { throw error }
                jwt.verify(data.token, jwt_secret, getDecoded);
                function getDecoded(error, user) {
                    if (error) { throw error }
                    if (user.username === "anonymous" || user.password === 123)
                        sio.emit("unauthorized", "Must login to add a share");
                    else if (true/* && user exists in database */)
                        sio.emit("addshare", data.share);
                }
            });
        }); function authorize() {
            sio.use(socketio_jwt.authorize({
                secret: jwt_secret,
                handshake: true
            }));
        }
    }, sign = function (user, callback) {
            var token = jwt.sign(user, jwt_secret, { expiresInMinutes: 60 * 5 });
            callback(null, token);
        }, decoded = function (object, callback) {
            var decoded = jwt.verify(object.token, jwt_secret, callback);
        };
    
    return {
        listen: listen,
        sign: sign,
        verify: decoded
    };
})();
module.exports = Communication;
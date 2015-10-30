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
        sio = "";
    var listen = function (server) {
        sio = socketIo.listen(server);
        authorize();
        sio.sockets
        .on('connection', function (socket) {
            console.log(socket.decoded_token.email, 'connected');
            socket.on("addshare", function (error, share) {
                sio.emit("addshare", share);
            });
        });
        function authorize() {
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
        decoded: decoded
    };
})();
module.exports = Communication;
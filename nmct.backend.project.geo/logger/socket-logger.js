/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Socket logger (middleware)
 =============================================================================*/

var logger = function (socket, next) {
    var fileLogger = require('./file-logger.js'),
        time = socket.handshake.time,
        url = socket.handshake.url;
    fileLogger(time + "-" + url, function (error) {
        if (error) { console.log(error); }
        next();
    });
};

module.exports = logger;
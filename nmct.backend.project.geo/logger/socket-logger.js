var logger = function (socket, next) {
    var fs = fs = require('fs');
    var time = socket.handshake.time;
    var url = socket.handshake.url;
    fs.appendFile("./logger/events.log", time + " - " + url + "\n", function (error) {
        if(error) { throw error; }
        next();    
    });
};

module.exports = logger;
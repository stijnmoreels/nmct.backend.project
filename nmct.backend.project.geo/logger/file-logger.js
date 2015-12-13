/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: File logger
 =============================================================================*/

var log = function (message, callback) {
    var fs = fs = require('fs');
    fs.appendFile("./logger/events.log", message + "\n\n", callback);
}

module.exports = log;
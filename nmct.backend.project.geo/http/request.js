/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Request Parser Server Side 
 =============================================================================*/
var Request = (function () {
    function parseRequest(data, callback) {
        var values = data.toString().split("&");
        var object = {};
        
        for (var i = 0, l = values.length; i < l; i++) {
            var propertySet = values[i].split("=");
            object[propertySet[0]] = propertySet[1];
        };
        callback(null, object);
    }
    
    return { parseRequest: parseRequest };
})();

module.exports = Request;
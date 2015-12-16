/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Request Parser Server Side (Middleware)
 =============================================================================*/

module.exports = function (request, response, next) {
    request.on("data", function (data) {
        var values = data.toString().split("&");
        var object = {};
        
        for (var i = 0, l = values.length; i < l; i++) {
            var propertySet = values[i].split("=");
            object[propertySet[0]] = propertySet[1].replace("%40", "@"); // email support
        } request.user = object;

        next();
    });
};
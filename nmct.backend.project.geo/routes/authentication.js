/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Route Authentication
 =============================================================================*/

var route = function (app) {
    // login (can see map but can't add shares)
    // because the socket communication is authorized
    // the first communication between client - server
    // has to come from ajax calls so the client can sign 
    // the socket communication with his/hers token
    var requestMiddleware = require("../http/request.js");
    app.post('/login', requestMiddleware, function (request, response) {
        var repository = require("../repository/generic.js"),
            fileLogger = require("../logger/file-logger.js"),
            tokenService = require("../authentication/token.js"),
            loggedInUser = {};
        
        // get user from credentials
        if (request.user)
            repository.getOne(request.user, "users", signUserCallback);
        
        // sign user in the application
        function signUserCallback(error, user) {
            if (error) { fileLogger(error); }
            else if (user.length === 0) {
                // No user found
                response.json({ token: null, user: null, error: "No user found" });
            } else if (user !== null && user.length !== 0) {
                // We are sending the profile inside the token
                loggedInUser = user;
                tokenService.sign(user, getToken);
            }
        }
        
        // get token to send back to the client
        function getToken(error, token) {
            if (error) { fileLogger(error); }
            else response.json({ token: token, user: loggedInUser[0] });
        }
    });
};

module.exports = route;
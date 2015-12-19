/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Token service (Authentication)
 =============================================================================*/

var tokenService = (function () {
    "use-strict";
    var jwt = require('jsonwebtoken'),
        jwt_secret = require("../config/configuration.js").jwt_secret;
    
    // sign user, means he gets a token 
    function sign(user, callback) {
        var token = jwt.sign(user, jwt_secret, { expiresIn: 60 * 5 }); // 5 min expiration time
        if (token) callback(null, token);
        else callback("error with token", null);
    }
    // get the user from the token
    function verify(token, callback) {
        jwt.verify(token, jwt_secret, callback);
    }
    
    // public methods
    return {
        sign: sign,
        verify: verify
    }
})();

module.exports = tokenService;
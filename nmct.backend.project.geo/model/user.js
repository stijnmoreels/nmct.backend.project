/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: User Model
 =============================================================================*/
var User = function () {
    this.id = 0;
    this.username = "";
    this.email = "";
    this.passwordHash = "";
    this.isAdmin = false;
};

User.prototype = {
    InitializeUser: function (id, username, email, passwordHash, isAdmin) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHahj;
        this.isAdmin = isAdmin;
    }
};

module.exports = User;
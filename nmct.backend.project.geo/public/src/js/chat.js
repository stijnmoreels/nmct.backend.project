/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Chat Integration
 =============================================================================*/

var chat = (function () {
    function addUserToOnlineUsers(error, user) {
        // anonymous check (debug)
        if (user !== undefined) {
            var li = document.createElement("li");
            
            // chat status
            var div = document.createElement("div");
            div.setAttribute("class", "chat-status");
            li.appendChild(div);
            
            // username
            li.appendChild(document.createTextNode(user));
            li.id = user;
            li.setAttribute("class", "list-group-item");
            
            // add to list
            var ul = document.getElementById("users");
            ul.appendChild(li);
        }
    }
    
    function deleteUserToOnlineusers(error, username) {
        document.getElementById(username).remove();
    }
    
    return {
        addUser: addUserToOnlineUsers,
        deleteUser: deleteUserToOnlineusers,
    }
})();

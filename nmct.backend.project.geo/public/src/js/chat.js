/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Chat Integration
 =============================================================================*/

var chat = (function () {

    var selectedUser;
    var messages = [];
    var message = { currentUser: [], chatPartner: [] };

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
            li.setAttribute("class", "list-group-item online-users");

            // add to list
            var ul = document.getElementById("users");
            ul.appendChild(li);
            
            // init messages
            messages[user] = { currentUser: [], chatPartner: [] };

            getUsers();
        }
    }

    function getUsers() {
        var users = document.getElementsByClassName("online-users");
        for (var i = 0, l = users.length; i < l; i++) {

            users[i].addEventListener('click', function () {
                selectedUser = users[i].id;
            });

        }
    }

    function deleteUserToOnlineusers(error, username) {
        document.getElementById(username).remove();
    }

    return {
        addUser: addUserToOnlineUsers,
        deleteUser: deleteUserToOnlineusers,
        selectedUser: selectedUser,
        messages: messages
    }
})
();

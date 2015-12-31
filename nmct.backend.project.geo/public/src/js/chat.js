/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels / Arne Tesch
 * @language: Javascript
 * @purpose: Client Side Chat Integration
 =============================================================================*/

var chat = (function () {
    
    var selectedUser,
        messages = [],
        message = { currentUser: [], chatPartner: [] };
    
    // add users to list of online users
    function addUserToOnlineUsers(error, user) {
        // anonymous check (debug)
        if (user !== undefined && document.getElementById(user) === null) {
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
    // initialisation method 'getUsers'
    function getUsers() {
        var users = document.getElementsByClassName("online-users");
        
        var sentMessage = document.getElementsByClassName("sent-message")[0];
        var receivedMessage = document.getElementsByClassName("received-message")[0];
        var btnsend = document.getElementById("btn-send");
        var selectedUser = document.getElementById("selected-user");

        if (chat.selectedUser === "" || typeof (chat.selectedUser) === "undefined" || chat.selectedUser === null) {
            btnsend.setAttribute("disabled", true);
        }

        
        // fill user list
        for (var i = 0, l = users.length; i < l; i++) {
            var index = i;
            (function (index) {
                // click listener
                users[index].addEventListener('click', function () {
                    // feedback
                    chat.selectedUser = users[index].id;
                    $(this).parent().children().removeClass("active");
                    $(this).addClass("active");
                    btnsend.removeAttribute("disabled");
                    // empty conversation
                    sentMessage.innerHTML = "";
                    receivedMessage.innerHTML = "";
                    // add messages back to chat
                    addMessageToChat(chat.selectedUser);
                    //show selected user
                    selectedUser.innerHTML = users[index].id;

                });
            }(index))
        }
    }
    // add message to chat box (pure HTML)
    function addMessageToChat(username) {
        var sentMessage = document.getElementsByClassName("sent-message")[0];
        var receivedMessage = document.getElementsByClassName("received-message")[0];
        sentMessage.innerHTML = "";
        receivedMessage.innerHTML = "";
        
        // fill current user chat history
        for (var i = 0, l = messages[username].currentUser.length; i < l; i++) {
            var div = document.createElement('div');
            div.setAttribute("class", "sent-message-box");
            div.innerHTML = messages[username].currentUser[i];
            sentMessage.appendChild(div);
        }
        
        // fill chat partner history
        for (var i = 0, l = messages[username].chatPartner.length; i < l; i++) {
            var div = document.createElement('div');
            div.setAttribute("class", "received-message-box");
            div.innerHTML = messages[username].chatPartner[i];
            receivedMessage.appendChild(div);
        }

    }
    // delete user from user list
    function deleteUserToOnlineUsers(error, username) {
        document.getElementById(username).remove();
    }
    
    // public methods
    return {
        addUser: addUserToOnlineUsers,
        deleteUser: deleteUserToOnlineUsers,
        selectedUser: selectedUser,
        messages: messages,
        addMessageToChat: addMessageToChat
    }
})
();

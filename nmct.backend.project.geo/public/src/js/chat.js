﻿/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Chat Integration
 =============================================================================*/

var chat = (function () {

    var selectedUser;
    var messages = [];
    var message = {currentUser: [], chatPartner: []};

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
            messages[user] = {currentUser: [], chatPartner: []};

            getUsers();
        }
    }

    function getUsers() {
        var users = document.getElementsByClassName("online-users");

        var sentMessage = document.getElementsByClassName("sent-message");
        var receivedMessage = document.getElementsByClassName("received-message");


        for (var i = 0, l = users.length; i < l; i++) {
            var index = i;
            (function (index) {
                users[index].addEventListener('click', function () {
                    chat.selectedUser = users[index].id;
                    sentMessage.innerHTML = "";
                    receivedMessage.innerHTML = "";
                });
            }(index))
        }
    }

    function addMessageToChat() {
        var sentMessage = document.getElementsByClassName("sent-message")[0];
        var receivedMessage = document.getElementsByClassName("received-message")[0];
        sentMessage.innerHTML = "";
        receivedMessage.innerHTML = "";

        for (var i = 0, l = messages[chat.selectedUser].currentUser.length; i < l; i++) {
            var div = document.createElement('div');
            div.innerHTML = messages[chat.selectedUser].currentUser[i];
            sentMessage.appendChild(div);
        }

        for (var i = 0, l = messages[chat.selectedUser].chatPartner.length; i < l; i++) {
            var div = document.createElement('div');
            div.innerHTML = messages[chat.selectedUser].chatPartner[i];
            receivedMessage.appendChild(div);
        }

    }

    function deleteUserToOnlineusers(error, username) {
        document.getElementById(username).remove();
    }

    return {
        addUser: addUserToOnlineUsers,
        deleteUser: deleteUserToOnlineusers,
        selectedUser: selectedUser,
        messages: messages,
        addMessageToChat: addMessageToChat
    }
})
();

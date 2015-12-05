/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Chat Integration
 =============================================================================*/

function addUserToOnlineUsers(error, user) {
    //var li = '<li id="' + user.socketId + '" class="list-group-item">' + user.username + '</li>';
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(user.username));
    li.id = user.socketId;
    li.setAttribute("class", "list-group-item");
    var ul = document.getElementById("users");
    ul.appendChild(li);
}

function deleteUserToOnlineusers(error, socketId) {
    document.getElementById(socketId).remove();
}

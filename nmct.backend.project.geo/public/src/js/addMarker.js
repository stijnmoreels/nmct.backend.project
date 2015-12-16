/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Google Maps Integration
 =============================================================================*/

var markers = [];
var contentString = "";
var previousShareId = "";

// Add share to infowindow activity
function addShareToMap(error, share) {
    // Check if the previousShareId is the new Share
    if (share.id !== previousShareId) {
        previousShareId = share.id;
        var marker = markers[share.activityId]; // get marker for the given "activityId"
        var badge = document.getElementById("badge_" + share.activityId + "_" + share.feeling); // get the right badge in the infowindow
        var innerValue = parseInt(badge.innerHTML);
        badge.innerHTML = isNaN(innerValue) || innerValue === 0 ? 1 : ++innerValue; // set the new value to the badge
    }
}

// Delete activity from map
function deleteActivityFromMap(error, activityId) {
    if (error) { console.log(error); }
    var marker = markers[activityId];
    marker.setMap(null);
}

// Add activity to map with an infowindow
function addActivityToMap(error, activity) {
    var marker = new google.maps.Marker({
        position: { lat: activity.latitude, lng: activity.longitude },
        icon: '../images/activity_pin@xs.png',
        map: map
    });
    
    marker.set("id", activity.id);
    markers[activity.id] = marker;
    
    // find out how much shares each feeling has in this activity
    var feelings = { "happy": 0, "sad": 0, "excited": 0, "tender": 0, "angry": 0, "scared": 0 };
    var shares = allSignedShares[activity.id];
    if (shares !== undefined)
        for (var i = 0, l = shares.length; i < l; i++) {
            feelings[shares[i].feeling]++;
        }
    
    // Infowindow HTML
    contentString =
        '<div id="iw-container" class="container">' +
            '<div class="row">' +
                '<h1 class="iw-title">' + activity.activityName + '</h1>' +
                '<div class="col-sm-5">' +
                    '<div class="list-group">' +
                        '<button id="btn' + activity.id + '_happy" value="happy" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/happy@xs.png" alt="happy">' +
                            '<span class="feeling-text">Happy </span>' +
                            ' <span class="badge share-count" id="badge_' + activity.id + '_happy">' + feelings["happy"] + '</span>' +
                        '</button>' +
                        '<button id="btn' + activity.id + '_excited" value="excited" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/excited@xs.png" alt="excited">' +
                            '<span class="feeling-text">Excited</span>' +
                            ' <span class="badge share-count" id="badge_' + activity.id + '_excited">' + feelings["excited"] + '</span>' +
                        '</button>' +
                        '<button id="btn' + activity.id + '_tender" value="tender" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/tender@xs.png" alt="tender">' +
                            '<span class="feeling-text">Tender</span>' +
                            '<span class="badge share-count" id="badge_' + activity.id + '_tender">' + feelings["tender"] + '</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="col-sm-5">' +
                '<div class="list-group feelings-right">' +
                        '<button id="btn' + activity.id + '_scared" value="scared" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/scared@xs.png" alt="scared">' +
                            '<span class="feeling-text">Scared</span>' +
                            '<span class="badge share-count" id="badge_' + activity.id + '_scared">' + feelings["scared"] + '</span>' +
                        '</button>' +
                        '<button id="btn' + activity.id + '_sad" value="sad" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/sad@xs.png" alt="sad">' +
                            '<span class="feeling-text">Sad</span>' +
                            '<span class="badge share-count" id="badge_' + activity.id + '_sad">' + feelings["sad"] + '</span>' +
                        '</button>' +
                        '<button id="btn' + activity.id + '_angry" value="angry" class="list-group-item feeling-btn">' +
                            '<img class="feeling-icon" src="./images/angry@xs.png" alt="angry">' +
                            '<span class="feeling-text">Angry</span>' +
                            '<span class="badge share-count" id="badge_' + activity.id + '_angry">' + feelings["angry"] + '</span>' +
                        '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
        '<div class="alert alert-success alert-dismissable share-success" role="alert">' +
        '<span>Thanks for sharing!</span>' +
        '<button class="close-alert" data-dismiss="alert">&times;</button>'+
        '</div>' +
         '<button ng-show="isAdmin" id="btnDelete_' + activity.id + '" class="btn btn-danger" >Delete</button>' +
        '</div>';
    
    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    function handleClick(feeling) {
        // block event if the user already has a share in this activity
        // TODO: (above)
        
        var activityID = activity.id;
        //document.getElementById("activityID").value = activityID;
        
        var lat, lng;
        var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
        
        function getPosition(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            
            // Register ShareModel
            shareModel.id = new Date().getTime() + "-" + localStorage.username;
            shareModel.feeling = feeling;
            shareModel.latitude = lat;
            shareModel.longitude = lng;
            shareModel.timestamp = new Date().toLocaleDateString();
            shareModel.author = localStorage.username;
            shareModel.activityId = activityID;
            
            // Add share to database
            client.addShare(shareModel, function (error, share) {
                if (error) {
                    console.log(error);
                }
                // just a callback check, the new share will be added in the "addShareToMap" method
                console.log('share added');

            });
        }
    }
    
    google.maps.event.addListener(infoWindow, 'domready', function () {
        
        // set click listener for each feeling (for each infowindow)
        var feelings = ["happy", "excited", "tender", "sad", "scared", "angry"];
        for (var i = 0, l = feelings.length; i < l; i++) {
            (function (i) {
                // Click listener for button within infowindow
                document.getElementById("btn" + activity.id + "_" + feelings[i]).addEventListener("click", function (e) {
                    handleClick(feelings[i]);
                });
            })(i);
        }
        
        if (!client.isAdmin) {
            var button = document.querySelector('button[id^="btnDelete_' + activity.id + '"]');
            button.style.display = "none";
        }
        
        // callback for click listenser (add share)
        function handleClick(feeling) {
            // block event if the user already has a share in this activity
            //getUserSharesForActivity(localStorage.username, activity.id, function (error, share) {
            //    if (error) { console.log(error); }
            //    if (share == null)
            //        // continue add share
            //    else
            //        // block 
            
            //});
            
            var activityID = activity.id;
            //document.getElementById("activityID").value = activityID;
            
            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
            
            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                
                // Register ShareModel
                shareModel.id = new Date().getTime() + "-" + localStorage.username;
                shareModel.feeling = feeling;
                shareModel.latitude = lat;
                shareModel.longitude = lng;
                shareModel.timestamp = new Date().toLocaleDateString();
                shareModel.author = localStorage.username;
                shareModel.activityId = activityID;
                
                // Add share to database
                client.addShare(shareModel, function (error, share) {
                    if (error) {
                        console.log(error);
                    }
                    // just a callback check, the new share will be added in the "addShareToMap" method
                    console.log('share added');
                    var alert = document.querySelector(".share-success");
                    $(".share-success").animate({
                        visibility: "visibile",
                        opacity: 1
                    }, 2000);

                });
            }
        }
        
        // admin only
        document.getElementById("btnDelete_" + activity.id).addEventListener("click", function (e) {
            client.deleteActivity(activity.id, function (error, activityId) {
                console.log("delete activity");
            });
        });
        
        // check if the user already has a share in the activity
        // if so ? return that share
        function getUserSharesForActivity(username, activityId, callback) {
            // reference array based on activityId
            var shares = allSignedShares[activityId];
            if (shares == null || shares.length <= 0)
                callback(null, null);
            for (var i = 0, l = shares.length; i < l; i++)
                if (shares[i].author === username)
                    // share found
                    callback(null, share);
            // make sure we always return the callback
            callback(null, null);
        }
    });
    
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}

function addUnsignedShareToMap(error, share) {
    var marker = new google.maps.Marker({
        position: { lat: share.latitude, lng: share.longitude },
        icon: '../images/' + share.feeling + '-pin.png',
        map: map
    });
    
    var userShares = allUnsignedShares[share.author];
    var contentStringShare = '<div id="iw-container" class="container">' +
                                '<div class="row">' +
                                    '<h1 class="iw-title">@' + share.author + '</h1>' + 
                                    '<p>' + share.feeling + '</p>' +
                                '</div>' + 
                             '</div>';
    
    var infoWindow = new google.maps.InfoWindow({
        content: contentStringShare
    });
    
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}
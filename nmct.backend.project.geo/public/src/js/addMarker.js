/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch
 * @language: Javascript
 * @purpose: Client Side Google Maps Integration
 =============================================================================*/

var markers = [];
var contentString = "";

// Add share to infowindow activity
function addShareToMap(error, share) {
    var marker = markers[share.activityId]; // get marker for the given "activityId"
    var badge = document.getElementById(share.activityId + "_" + share.feeling.toLocaleLowerCase()); // get the right badge in the infowindow 
    var innerValue = parseInt(badge.innerHTML);
    badge.innerHTML = isNaN(innerValue) || innerValue === 0 ? 1 : ++innerValue; // set the new value to the badge
}

// Add activity to map with an infowindow
function addActivityToMap(error, activity) {
    var marker = new google.maps.Marker({
        position: { lat: activity.latitude, lng: activity.longitude },
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: map
    });
    
    marker.set("id", activity.id);
    markers[activity.id] = marker;
    
    // Get shares for the given activity
    
    
    //var allShares = {};
    //client.getSharesForActivity(activity.id, function (error, shares) {
    //    if (error) { console.log(error); }
    //    allShares = shares;
    //});
    
    var feelings = { "happy": 0, "sad": 0, "excited": 0, "tender": 0, "angry": 0, "scared": 0 };
    var shares = allShares[activity.id];
    if (shares !== undefined)
        for (var i = 0, l = shares.length; i < l; i++) {
            feelings[shares[i].feeling]++;
        };
    
    
    
    // Infowindow HTML
    contentString =
        '<div id="iw-container">' +
        '<h1 class="iw-title">' + activity.activityName + '</h1>' +
        '<div class="iw-content">' +
        '<div class="form-group">' +
        '<ul class="list-group">' +
        '<li class="list-group-item"><span id="' + activity.id + '_happy" class="badge">' + feelings["happy"] + '</span><img src="../images/happy@xs.png" alt="happy">   Happy</li>' +
        '<li class="list-group-item"><span id="' + activity.id + '_excited" class="badge">' + feelings["sad"] + '</span><img src="../images/sad@xs.png" alt="sad">    Sad</li>' +
        '<li class="list-group-item"><span id="' + activity.id + '_tender" class="badge">' + feelings["excited"] + '</span><img src="../images/excited@xs.png" alt="excited">    Excited</li>' +
        '<li class="list-group-item"><span id="' + activity.id + '_scared" class="badge">' + feelings["tender"] + '</span><img src="../images/tender@xs.png" alt="tender">    Tender</li>' +
        '<li class="list-group-item"><span id="' + activity.id + '_sad" class="badge">' + feelings["angry"] + '</span><img src="../images/angry@xs.png" alt="angry">    Angry</li>' +
        '<li class="list-group-item"><span id="' + activity.id + '_angry" class="badge">' + feelings["scared"] + '</span><img src="../images/scared@xs.png" alt="scared">    Scared</li>' +
        '</ul>' +
        '</div>' +
        '<div class="form-group"><select id="feeling_' + activity.id + '" class="form-control" required>' +
        '<option value="happy">Happy</option>' +
        '<option value="excited">Excited</option>' +
        '<option value="tender">Tender</option>' +
        '<option value="scared">Scared</option>' +
        '<option value="sad">Sad</option>' +
        '<option value="angry">Angry</option>' 
        + '</select></div>' +
        '<button id="btnAdd_' + activity.id + '" class="btn btn-primary">Add Share</button>' +
        '</div>' +
        '</div>';
    
    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    google.maps.event.addListener(infoWindow, 'domready', function () {
        // Click listener for button within infowindow 
        document.getElementById("btnAdd_" + activity.id).addEventListener("click", function (e) {
            var activityID = activity.id;
            //document.getElementById("activityID").value = activityID;
            var feeling = document.getElementById("feeling_" + activity.id).value;
            
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
                    if (error) { console.log(error); }
                    // just a callback check, the new share will be added in the "addShareToMap" method
                    console.log('share added');
                });
            }

        });
    });
    
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}

/*
 * var contentString =
 '<div id="iw-container">' +
 '<h1 class="iw-title">Your Location</h1>' +
 '<div class="iw-content">'+
 '<div class="iw-activity"></div>' +
 '<button class="btn btn-primary">Add share to activity</button>' +
 '</div>' +
 '</div>';
 * */
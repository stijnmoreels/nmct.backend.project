var markers = [];
var contentString = "";

function addShareToMap(error, share) {
    var marker = markers[share.activityId];
    var badge = document.getElementById(share.activityId+"_"+share.feeling.toLocaleLowerCase());
    var innerValue = parseInt(badge.innerHTML);
    badge.innerHTML = ++innerValue;
}

function addActivityToMap(error, activity) {
    var marker = new google.maps.Marker({
        position: {lat: activity.latitude, lng: activity.longitude},
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: map
    });

    marker.set("id", activity.id);
    markers[activity.id] = marker;

    console.log(markers);
    contentString =
        '<div id="iw-container">' +
        '<h1 class="iw-title">' + activity.activityName + '</h1>' +
        '<div class="iw-content">' +
        '<div class="form-group">' +
        '<ul class="list-group">' +
        '<li class="list-group-item"><span id="'+ activity.id+'_happy" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '<li class="list-group-item"><span id="'+ activity.id+'_excited" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '<li class="list-group-item"><span id="'+ activity.id+'_tender" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '<li class="list-group-item"><span id="'+ activity.id+'_scared" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '<li class="list-group-item"><span id="'+ activity.id+'_sad" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '<li class="list-group-item"><span id="'+ activity.id+'_angry" class="badge"></span><i class="fa fa-smile-o"></i></li>' +
        '</ul>' +
        '</div>' +
        '<div class="form-group"><select id="feeling" class="form-control" required>' +
        '<option value="happy">Happy</option>' +
        '<option value="excited">Excited</option>' +
        '<option value="tender">Tender</option>' +
        '<option value="scared">Scared</option>' +
        '<option value="sad">Sad</option>' +
        '<option value="angry">Angry</option>'
        + '</select></div>' +
        '<button id="btnAdd" class="btn btn-primary">Add Share</button>' +
        '</div>' +
        '</div>';

    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(infoWindow, 'domready', function () {
        document.getElementById("btnAdd").addEventListener("click", function (e) {
            var activityID = activity.id;
            document.getElementById("activityID").value = activityID;
            var feeling = document.getElementById("feeling").value;

            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);

            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;

                shareModel.feeling = feeling;
                shareModel.latitude = lat;
                shareModel.longitude = lng;
                shareModel.timestamp = new Date().toLocaleDateString();
                shareModel.author = localStorage.username;

                client.addShare(shareModel, function (error, share) {
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
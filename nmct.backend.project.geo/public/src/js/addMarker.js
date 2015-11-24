function addShareToMap(error, share) {
    var marker = new google.maps.Marker({
        position: {lat: share.latitude, lng: share.longitude},
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        map: map
    });

    var contentString = '<h1 style="color:black">'+share.feeling+'</h1>';
    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}



function addActivityToMap(error, activity){
    var marker = new google.maps.Marker({
        position: {lat: activity.latitude, lng: activity.longitude},
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        map: map
    });

    var contentString =
        '<div id="iw-container">' +
            '<h1 class="iw-title">'+ activity.activityName+'</h1>' +
            '<div class="iw-content">'+
                '<p>'+ activity.feeling +'</p>'+
                '<button class="btn btn-primary">Add Share</button>'+
            '</div>' +
        '</div>';
    var infoWindow = new google.maps.InfoWindow({
        content: contentString
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
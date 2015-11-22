function addShareToMap(error, share) {
    var marker = new google.maps.Marker({
        position: {lat: share.latitude, lng: share.longitude},
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


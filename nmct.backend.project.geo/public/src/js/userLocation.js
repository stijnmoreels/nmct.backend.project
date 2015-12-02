(function () {
    "use strict";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showError(error);
    }
})();

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latlng = {lat: lat, lng: lng};
    placeMarkerAndPanTo(latlng, map);
}

function placeMarkerAndPanTo(latlng, map) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        draggable: true
    });
    map.panTo(latlng);

    var contentString =
        '<div id="iw-container">' +
            '<h1 class="iw-title">Event Name !</h1>' +
            '<div class="iw-content">'+
            '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
            'Assumenda at atque, corporis cupiditate debitis eaque eligendi, ' +
            'eos facilis, in laborum maxime odio porro quam recusandae sapiente sed sunt tempore vitae.</p>'+
            '<div><button class="btn btn-primary">Add Share</button></div>'+
            '</div>' +
        '</div>';


    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });


    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showErrorMsg();
            break;
        case error.POSITION_UNAVAILABLE:
            showErrorMsg();
            break;
        case error.TIMEOUT:
            showErrorMsg();
            break;
        case error.UNKNOWN_ERROR:
            showErrorMsg();
            break;
    }
}

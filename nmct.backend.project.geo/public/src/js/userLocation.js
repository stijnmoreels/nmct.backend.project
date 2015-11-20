(function () {
    "use strict";
    if (navigator.geolocation) {
        var position;
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showError(error);
    }
})();

function showPosition(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latlng = {lat:lat, lng:lng};
    placeMarkerAndPanTo(latlng, map);
}

function placeMarkerAndPanTo(latlng, map) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
    map.panTo(latlng);
}


function showError(error){


    switch(error.code) {
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

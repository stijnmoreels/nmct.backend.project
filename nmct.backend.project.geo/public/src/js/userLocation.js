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

    var x = document.getElementById("error-msg");

    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            $("#error").animate({
                width: '300px',
                height: '200px',
                opacity: 1.0
            }, "slow");
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
    }
}

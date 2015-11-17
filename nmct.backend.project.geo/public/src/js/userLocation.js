(function () {
    if (navigator.geolocation) {
        var position;
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        showError();
    }


    function showPosition(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        placeMarkerAndPanTo(lat, lng, map);
        console.log("latitude: " + lat + ", longitude: " +lng);
    }

    function placeMarkerAndPanTo(lat,lng, map) {
        var marker = new google.maps.Marker({
            position: {lat:lat, lng:lng},
            map: map
        });



        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;

        /*geocodeLatLng(geocoder, map, infowindow, latLng);*/


        map.panTo({lat:lat, lng:lng});
    }
})();

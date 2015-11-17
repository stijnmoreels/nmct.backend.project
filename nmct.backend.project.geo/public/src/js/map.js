/**
 * Created by Arne on 10/24/15.
 */
var map = (function () {
    "use strict";
    var initialize = function (element) {};
    return {
        initialize: function (element) {

            var mapCanvas = document.getElementById(element);
            var mapOptions = {
                center: new google.maps.LatLng(50.820301, 3.261038),
                zoom: 12,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
            /*map.addListener('click', function (e) {
               placeMarkerAndPanTo(e.latLng, map);
            });*/

            google.maps.event.addDomListener(window, 'load', initialize);
            google.maps.event.addDomListener(window, "resize", function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
        }
    };
})();

function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });



    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    /*geocodeLatLng(geocoder, map, infowindow, latLng);*/


    map.panTo(latLng);
}


/*function geocodeLatLng(geocoder, map, infowindow, latlngCoord) {
    var input = String(latlngCoord);
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}*/

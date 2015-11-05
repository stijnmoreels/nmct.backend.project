/**
 * Created by Arne on 10/24/15.
 */
var map;
(function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(50.820301, 3.261038),
        zoom: 12,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);

    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    map.addListener('click', function (e) {
        if(true){
            placeMarkerAndPanTo(e.latLng, map)
        }
    });
})();
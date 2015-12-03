/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch
 * @language: Javascript
 * @purpose: Client Side Google Maps Integration
 =============================================================================*/

var map = (function () {
    "use strict";
    var initialize = function (element) {};
    return {
        initialize: function (element) {

            var mapCanvas = document.getElementById(element);
            var mapOptions = {
                center: {lat: 50.824683, lng: 3.25141},
                zoom: 8,
                mapTypeControl: false,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapCanvas, mapOptions);


            google.maps.event.addDomListener(window, 'load', initialize);
            google.maps.event.addDomListener(window, "resize", function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
        }
    };
})();


/**
 * Created by Arne on 10/29/15.
 */

var mapType = (function () {
    "use strict";
    return {
        changeMapType: function (type) {
            switch(type){
                case 'hybrid':
                    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    break;
                case 'roadmap':
                    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    break;
                case 'satellite':
                    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    break;
                case 'terrain':
                    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                    break;
                default:
                    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
        }
    };
})();

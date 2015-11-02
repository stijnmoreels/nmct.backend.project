/**
 * Created by Arne on 10/29/15.
 */

var roadmap = document.getElementById("roadmap").addEventListener('click', function(){
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
});

var satellite = document.getElementById("satellite").addEventListener('click', function(){
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
});

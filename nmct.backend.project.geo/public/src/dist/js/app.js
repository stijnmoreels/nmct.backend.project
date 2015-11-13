(function () {
    map.initialize("map-canvas");
})();

var roadmap = document.getElementById("roadmap");
var hybrid = document.getElementById("hybrid");
var satellite = document.getElementById("satellite");
var terrain = document.getElementById("terrain");

roadmap.addEventListener('click', function () {
    mapType.changeMapType("roadmap");
});

hybrid.addEventListener('click', function () {
    mapType.changeMapType("hybrid");
});

satellite.addEventListener('click', function () {
    mapType.changeMapType("satellite");
});

terrain.addEventListener('click', function () {
    mapType.changeMapType("terrain");
});

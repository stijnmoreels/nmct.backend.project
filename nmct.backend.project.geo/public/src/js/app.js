(function () {

    map.initialize("map-canvas");

    var app = angular.module("app", ['ngRoute']);

    app.config(function ($logProvider, $routeProvider, $locationProvider) {

        $logProvider.debugEnabled(true);
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                controllerAs: 'login',
                templateUrl:'./templates/login.html'
            })
            .when('/register', {
                controller: 'RegisterController',
                controllerAs: 'register',
                templateUrl: './templates/register.html'
            })
            .when('/main',{
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: './templates/main.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    });

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
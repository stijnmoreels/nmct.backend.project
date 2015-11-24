(function () {

    map.initialize("map-canvas");

    var app = angular.module("app", ['ngRoute', 'ngCookies']);

    app.config(function ($logProvider, $routeProvider) {

        $logProvider.debugEnabled(true);
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                controllerAs: 'login',
                templateUrl: './templates/login.html'
            })
            .when('/register', {
                controller: 'RegisterController',
                controllerAs: 'register',
                templateUrl: './templates/register.html'
            })
            .when('/main', {
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: './templates/main.html',
                resolve: {}
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($rootScope.loggedInUser == null) {
                //console.log("no user");
                if (next.templateUrl === "./templates/main.html") {
                    $location.path("/");
                }
            }
        })
    });

})();

/*
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
 });*/

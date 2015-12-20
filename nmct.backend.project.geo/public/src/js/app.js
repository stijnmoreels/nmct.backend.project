/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Angluar.js
 =============================================================================*/
var allSignedShares = [[]],
    allUnsignedShares = [];
(function () {

    google.maps.event.addDomListener(window, 'load', createMap.initialize("map-canvas"));
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

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
                resolve: {
                    addUsers: function () {
                        // Add users to chat
                        //return client.getAllGeneric("users", function (error, users) { });
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function ($rootScope, $location, $cookies) {
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (!$rootScope.loggedInUser) {
                    //console.log("no user");
                    if (next.templateUrl === "./templates/main.html") {
                        $location.path("/");
                    }
                }
            })
        });

    createMap.getData();

})();


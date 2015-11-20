
var app = angular.module("MyApp", []).
    config(function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.
            when("/persons", { templateUrl: "partials/index.html" }).
            when("/persons/:id", { templateUrl: "partials/show.html", controller: "ShowCtrl" }).
            when("/login", { templateUrl: "partials/login.html", controller: "LoginCtrl" }).
            when("/help", { templateUrl: "partials/help.html" }).
            otherwise( { redirectTo: "/persons" });
    }).
    run(function($rootScope, $location) {

        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if ($rootScope.loggedInUser == null) {
                // no logged user, redirect to /login
                if ( next.templateUrl === "partials/login.html") {
                } else {
                    $location.path("/login");
                }
            }
        });
    });
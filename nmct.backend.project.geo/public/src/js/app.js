(function () {
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
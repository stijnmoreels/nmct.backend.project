var allShares = [[]];
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
    })
    /*.run(function ($rootScope, $location) {
     $rootScope.$on("$routeChangeStart", function (event, next, current) {
     if ($rootScope.loggedInUser == null) {
     //console.log("no user");
     if (next.templateUrl === "./templates/main.html") {
     $location.path("/");
     }
     }
     })
     });*/
    var getData = (function () {
        client.connectAnonymous(function (error, user) {
            if (error) {
                console.log(error)
            } else {
                // TODO: get only the signed shares
                // get shares from database
                client.getShares(function (error, shares) {
                    if (error) { connsole.log(error); }
                    for (var i = 0, l = shares.length; i < l; i++) {
                        var share = shares[i],
                            shareActivity = share.activityId + "";
                        // "allShares" is a global variable 
                        if (allShares[shareActivity] === undefined) {
                            allShares[shareActivity] = [];
                        } allShares[shareActivity].push(share);
                    };
                    // get activities from database
                    client.getActivities(function (error, activities) {
                        if (error) {
                            console.log(error);
                        } else {
                            allActivities = activities;
                            for (var i = 0, l = activities.length; i < l; i++) {
                                addActivityToMap(null, activities[i]);
                            }
                        }
                    });
                });
            }
        });
    })();

})();


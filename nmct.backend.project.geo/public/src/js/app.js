/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch / Stijn Moreels
 * @language: Javascript
 * @purpose: Client Side Angluar.js
 =============================================================================*/

var allSignedShares = [[]];
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
                // get shares from database
                client.getAllGeneric("signedshares", function (error, shares) {
                    if (error) {
                        console.log(error);
                    }
                    for (var i = 0, l = shares.length; i < l; i++) {
                        var share = shares[i],
                            shareActivity = share.activityId + "";
                        // "allShares" is a global variable 
                        if (allSignedShares[shareActivity] === undefined) {
                            allSignedShares[shareActivity] = [];
                        }
                        allSignedShares[shareActivity].push(share);
                    }
                    // get activities from database
                    client.getAllGeneric("activities", function (error, activities) {
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

                client.getAllGeneric("unsignedshares", function (error, shares) {
                    if(error){
                        console.log(error);
                    }
                    for(var i= 0, l=shares.length; i<l;i++){
                        addUnsignedShareToMap(null, shares[i]);
                    }
                });
            }
        });
    })();

})();


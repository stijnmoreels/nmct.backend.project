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

<<<<<<< HEAD
    createMap.getData();
=======
    var getData = (function () {
        //window.onbeforeunload = function () {
        //    return "The session will be expired when you reload the page.";
        //}
        
        
        //if (localStorage.hash && localStorage.username !== "anonymous") {
        //    client.rememberMeLogin(localStorage.username, localStorage.hash, function (error, user) {
        //        if (error) { console.log(error); }
        //        else {
        //            //$cookies.put("user", $scope.username);
        //            //$rootScope.loggedInUser = $scope.username;
        //            location.href = "/#/main";
        //            getInformationForTheMap();
        //        }
        //    });
        //} else {
            client.connectAnonymous(function (error, user) {
                if (error) { console.log(error) } 
                else { getInformationForTheMap(); }
            });
        //}

        function getInformationForTheMap() {
            // get signed shares (related to an activity)
            client.getAllGeneric("signedshares", function (error, shares) {
                if (error) {
                    console.log(error);
                }
                for (var i = 0, l = shares.length; i < l; i++) {
                    var share = shares[i],
                        shareActivity = share.activityId + "";
                    // "allSignedShares" is a global variable 
                    if (allSignedShares[shareActivity] === undefined) {
                        allSignedShares[shareActivity] = [];
                    }
                    allSignedShares[shareActivity].push(share);
                }
                // get activities from database
                client.getAllGeneric("activities", function (error, activities) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        allActivities = activities;
                        for (var i = 0, l = activities.length; i < l; i++) {
                            addActivityToMap(null, activities[i]);
                        };
                    }
                });
            });
            
            // get unsigned shares (not related to an activity)
            client.getAllGeneric("unsignedshares", function (error, shares) {
                if (error) {
                    console.log(error);
                }
                for (var i = 0, l = shares.length; i < l; i++) {
                    var author = shares[i].author;
                    if (allUnsignedShares[author] === undefined)
                        allUnsignedShares[author] = [];
                    allUnsignedShares[author].push(shares[i]);
                } for (var i = 0, l = shares.length; i < l; i++) {
                    addUnsignedShareToMap(null, shares[i]);
                }; 
            });
        }
    })();
>>>>>>> origin/master

})();


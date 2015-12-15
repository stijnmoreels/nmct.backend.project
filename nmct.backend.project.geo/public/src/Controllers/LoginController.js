(function () {
    var app = angular.module("app");
    
    var LoginController = function ($scope, $location, $rootScope, $cookies) {
        
        var allShares = [];
        var allActivities = [];
        
        // pure designwise, has no security issues
        $scope.isAdmin = localStorage.isAmin == undefined || !localStorage.isAdmin ? false : true;

        $scope.userLogin = function () {
            //$location.path("/main");
            $rootScope.loggedInUser = null;
            client.login($scope.username, $scope.password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $cookies.put("user", $scope.username);
                    $rootScope.loggedInUser = $scope.username;
                    localStorage.username = $scope.username;
                    location.href = "/#/main";
                }
            });
        };

/*        //document.querySelector("#loginButton").addEventListener("click", l);
        var l = function () {
            //$location.path("/main");

            $rootScope.loggedInUser = null;
            client.login($scope.username, $scope.password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    //$cookieStore.put("username", $scope.username);
                    $rootScope.loggedInUser = $scope.username;
                    localStorage.username = $scope.username;
                    $location.path("/main");
                }
            });
        };*/

    };
    app.controller("LoginController", ["$scope", "$location", "$rootScope","$cookies", LoginController]);
})();
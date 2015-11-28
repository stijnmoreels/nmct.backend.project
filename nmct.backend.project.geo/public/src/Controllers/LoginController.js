(function () {
    var app = angular.module("app");
    
    var LoginController = function ($scope, $location, $rootScope) {
        
        var allShares = [];
        $scope.getShares = (function () {
            client.connectAnonymous(function (error, user) {
                if (error) {
                    console.log(error)
                } else {
                    client.getShares(function (error, shares) {
                        if (error) {
                            console.log(error);
                        } else {
                            allShares = shares;
                            for (var i = 0, l = shares.length; i < l; i++) {
                                addShareToMap(null, shares[i]);
                            }
                        }
                    });
                }
            });
        })();
        
        $scope.userLogin = function () {
            $rootScope.loggedInUser = null;
            client.login($scope.username, $scope.password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    //$cookieStore.put("username", $scope.username);
                    $rootScope.loggedInUser = $scope.username;
                    $location.path("/main");
                }
            });
        };

    };
    app.controller("LoginController", ["$scope", "$location", "$rootScope", LoginController]);
})();
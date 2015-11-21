(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location, $rootScope) {

        $scope.userLogin = function () {
            $rootScope.loggedInUser = null;
            client.login($scope.username, $scope.password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $rootScope.loggedInUser = $scope.username;
                    $location.path("/main");
                }
            });
        };

    };
    app.controller("LoginController", ["$scope", "$location","$rootScope", LoginController]);
})();
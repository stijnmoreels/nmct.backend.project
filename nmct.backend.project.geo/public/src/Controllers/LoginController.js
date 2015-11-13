(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {

        $scope.login = function (username, password) {
            client.connectAnnonymous(function (error, user) {
               client.login(username, password, function (error, shares) {
                   //get shares from user
               });
            });
        };

    };



    app.controller("LoginController", LoginController);
})();
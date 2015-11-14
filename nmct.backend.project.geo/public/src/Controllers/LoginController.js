(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {

        $scope.username = "stijn@moreels";
        $scope.password = "123";

        $scope.login = function (username, password) {
            //client.connectAnnonymous(function (error, user) {
               client.login(username, password, function (error, shares) {
                   client.getShares(function (error, shares) {
                       console.log(shares);
                   })
               });
            //});
        };

    };



    app.controller("LoginController", LoginController);
})();
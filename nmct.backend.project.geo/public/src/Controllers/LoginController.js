(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {

        $scope.login = login;

        $scope.login = function () {
            /*client.login(username, password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $location.path("/main");
                }
               });*/
            alert('ok');
        };

    };



    app.controller("LoginController", LoginController);
})();
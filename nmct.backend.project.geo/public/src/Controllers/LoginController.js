(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {


        $scope.userLogin = function (username, password) {
            client.login(username, password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $location.path("/main");
                }
               });
            console.log("username:  " + $scope.username + ", password: " + $scope.password);
            //alert('ok');
        };

    };

    app.controller("LoginController", LoginController);
})();
(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {

<<<<<<< HEAD

        $scope.userLogin = function () {
            client.login($scope.username, $scope.password, function (error, user) {
=======
        //$scope.login = login;

        $scope.userLogin = function (username, password) {
            client.login(username, password, function (error, user) {
>>>>>>> origin/master
                if (error) {
                    console.log(error);
                } else {
                    $location.path("/main");
                }
               });
<<<<<<< HEAD
            console.log("username:  " + $scope.username + ", password: " + $scope.password);
=======
            //alert('ok');
>>>>>>> origin/master
        };

    };



    app.controller("LoginController", LoginController);
})();
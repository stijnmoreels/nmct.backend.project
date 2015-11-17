(function () {
    var app = angular.module("app");

    var LoginController = function ($scope, $location) {

        $scope.userLogin = function () {
            $location.path('/main');
            client.login($scope.username, $scope.password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $location.path("#/main");
                }
               });
            console.log("username:  " + $scope.username + ", password: " + $scope.password);
            //alert('ok');
        };
        /*client.login(username, password, function (error, user) {
         if (error) {
         console.log(error);
         } else {
         $location.path("/main");
         }
         });*/

    };

    app.controller("LoginController", ["$scope","$location",LoginController]);
})();
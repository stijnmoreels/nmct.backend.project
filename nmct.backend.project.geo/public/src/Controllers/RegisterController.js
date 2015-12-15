(function () {
    var app = angular.module("app");

    var RegisterController = function ($scope, $location, $rootScope) {

        $rootScope.loggedInUser = null;


        $scope.userRegister = function () {
            var username = $scope.lname + "" + $scope.fname;
            client.register($scope.lname, $scope.fname, username, $scope.password, function(error, user){
                if(error){
                   console.log(error);
               }else{
                   $rootScope.loggedInUser = username;
                   client.login(username, $scope.password, function (error, user) {
                       location.href = "/#/main";
                   });
               }
            });
        }

    };

    app.controller("RegisterController",["$scope", "$location","$rootScope", RegisterController]);
})();
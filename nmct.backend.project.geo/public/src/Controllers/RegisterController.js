(function () {
    var app = angular.module("app");

    var RegisterController = function ($scope, $location, $rootScope) {

        $rootScope.loggedInUser = null;

        $scope.userRegister = function () {
            client.register($scope.lname, $scope.fname, $scope.email, $scope.password, function(error, user){
               if(error){
                   console.log(error);
               }else{
                   $rootScope.loggedInUser = $scope.email;
                   $location.path('/main');
               }
            });
        }

    };

    app.controller("RegisterController",["$scope", "$location","$rootScope", RegisterController]);
})();
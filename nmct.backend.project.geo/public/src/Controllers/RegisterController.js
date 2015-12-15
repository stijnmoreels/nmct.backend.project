(function () {
    var app = angular.module("app");

    var RegisterController = function ($scope, $location, $rootScope) {

        $rootScope.loggedInUser = null;


        $scope.userRegister = function () {
            // block event if the input fields doesn't match the Regular Expression
            var regularExpression = new RegExp("^[a-zA-Z]*$");
            if (!(regularExpression.test($scope.fname)) || !(regularExpression.test($scope.lname)))
                return;
            var username = $scope.lname + "" + $scope.fname;
            var isAvailable = true; // TODO: get checkbox
            client.register($scope.lname, $scope.fname, username, $scope.password, isAvailable, function (error, user) {
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
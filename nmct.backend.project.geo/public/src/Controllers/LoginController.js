(function () {
    var app = angular.module("app");
    
    var LoginController = function ($scope, $location) {
        
        $scope.login = function (username, password) {
            client.login(username, password, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    $location.path("/main");
                }
            });
        };
    };
    
    
    
    app.controller("LoginController", LoginController);
})();
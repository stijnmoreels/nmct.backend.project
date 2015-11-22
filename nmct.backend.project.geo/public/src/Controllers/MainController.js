(function () {
    var app = angular.module("app");

    var MainController = function ($scope) {

        var isActivity = document.getElementById("isActivity").value;

        $scope.addShareToMap = function () {
            if(isActivity){
                client.ad
            }else{

            }
        };


    };

    app.controller("MainController", ["$scope",MainController]);
})();
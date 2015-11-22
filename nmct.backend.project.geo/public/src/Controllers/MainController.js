(function () {
    var app = angular.module("app");

    var MainController = function ($scope) {

        var allShares = [];
        $scope.getShares = (function () {
            client.getShares(function (error, shares) {
                if(error){
                    console.log(error);
                }else {
                    allShares = shares;
                }
            });
        })();


    };

    app.controller("MainController", ["$scope",MainController]);
})();
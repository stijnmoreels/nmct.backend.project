(function () {
    var app = angular.module("app");

    var MainController = function ($scope, $rootScope, $location) {

        $scope.addShareDb = function () {
            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);

            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;

                activityModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                activityModel.activityName = $scope.activityName;
                activityModel.feeling = $scope.feelings;
                activityModel.latitude = lat;
                activityModel.longitude = lng;
                activityModel.timestamp = new Date().toLocaleDateString();
                activityModel.author = $rootScope.loggedInUser;

                client.addActivity(activityModel, function (error, activity) {
                    //addActivityToMap(error, activity);
                    console.log("added");
                });
            }
        };

        $scope.logout = function () {
            $rootScope.loggedInUser = null;
            $location.path("/");
        };

        $scope.changeMap = function () {
            var target = event.target || event.srcElement || event.originalTarget;
            mapType.changeMapType(target.id);
        };
    };

    app.controller("MainController", ["$scope", "$rootScope", "$location", MainController]);
})();
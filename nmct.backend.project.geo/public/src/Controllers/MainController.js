(function () {
    var app = angular.module("app");

    var MainController = function ($scope, $rootScope, $location) {
        
        // pure designwise, has no security issues
        $scope.isAdmin = localStorage.isAmin == undefined || !localStorage.isAdmin ? false : true;

        $scope.addActivityDb = function () {

            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);


            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;


                if ($scope.activityName) {
                    activityModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    activityModel.activityName = $scope.activityName;
                    activityModel.feeling = $scope.feeling;
                    activityModel.latitude = lat;
                    activityModel.longitude = lng;
                    activityModel.timestamp = new Date().toLocaleDateString();
                    activityModel.author = $rootScope.loggedInUser;

                    client.addActivity(activityModel, function (error, activity) {
                        //addActivityToMap(error, activity);
                        console.log("activity added");
                    });
                } else {
                    shareModel.activityId = 0;
                    shareModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    shareModel.feeling = $scope.feeling;
                    shareModel.latitude = lat;
                    shareModel.longitude = lng;
                    shareModel.timestamp = new Date().toLocaleDateString();
                    shareModel.author = $rootScope.loggedInUser;

                    client.addShare(shareModel, function (error, share) {
                        console.log("share added")
                    });

                }

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
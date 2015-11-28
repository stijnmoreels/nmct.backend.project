(function () {
    var app = angular.module("app");
    
    var MainController = function ($scope, $rootScope, $location) {


        var isActivity = document.getElementById("isActivity");


        $scope.addShareDb = function () {
            if (isActivity.checked) {
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
            } else {
                
            }
        };

        $scope.logout = function(){
            $rootScope.loggedInUser = null;
            $location.path("/");
        }


    };
    
    app.controller("MainController", ["$scope", "$rootScope","$location", MainController]);
})();
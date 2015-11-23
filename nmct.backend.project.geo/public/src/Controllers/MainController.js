(function () {
    var app = angular.module("app");
    
    var MainController = function ($scope, $rootScope) {
        
        var isActivity = document.getElementById("isActivity").checked;
        
        $scope.addShareDb = function () {
            
            if (isActivity) {
                var lat, lng;
                var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
                function getPosition(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    
                    activityModel.id = new Date().getDate() + "-" + $rootScope.loggedInUser;
                    activityModel.feeling = $scope.feelings;
                    activityModel.latitude = lat;
                    activityModel.longitude = lng;
                    activityModel.timestamp = new Date().getDate();
                    activityModel.author = $rootScope.loggedInUser;
                    
                    client.addActivity(activityModel, function (error, activity) {
                        // addActivityToMap(error, activity);
                        console.log("added");
                    });
                }
            } else {
                
            }
        };


    };
    
    app.controller("MainController", ["$scope", "$rootScope", MainController]);
})();
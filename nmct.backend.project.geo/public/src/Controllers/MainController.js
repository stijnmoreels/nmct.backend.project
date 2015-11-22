(function () {
    var app = angular.module("app");

    var MainController = function ($scope) {

        var isActivity = document.getElementById("isActivity").value;

        $scope.addShareDb = function () {

            if(isActivity){
                var lat, lng;
                var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
                function getPosition(position){
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;

                    activityModel.id = new Date().getDate() + "-"+ $rootScope.loggedInUser;
                    activityModel.feeling = $scope.feelings;
                    activityModel.latitude = lat;
                    activityModel.longitude = lng;
                    activityModel.timestamp = new Date().getDate();
                    activityModel.author = $rootScope.loggedInUser;

                    client.addActivity(activityModel, function (error, activity) {
                        addActivityToMap(error, activity);
                    });
                }


            }else{
            }
        };


    };

    app.controller("MainController", ["$scope",MainController]);
})();
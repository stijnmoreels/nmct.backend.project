(function () {
    var app = angular.module("app");
    
    var MainController = function ($scope, $rootScope, $location, $cookies) {
        
        // pure designwise, has no security issues
        //$scope.isAdmin = localStorage.isAmin == undefined || !localStorage.isAdmin ? false : true;
        //$scope.isAdmin = false;
        //$cookies.put("user", $scope.username);
        //$rootScope.loggedInUser = $scope.username;
        
        // feelings initialisation
        var feelings = ["happy", "excited", "tender", "sad", "scared", "angry"];
        for (var i = 0, l = feelings.length; i < l; i++) {
            (function (i) {
                // Click listener for button within infowindow
                $("#" + feelings[i]).bind("click", function (e) {
                    if (feelings[i] == $scope.feeling) {
                        $("#" + $scope.feeling).addClass("active");
                    } else {
                        $("#" + $scope.feeling).removeClass("active");
                    }
                });
            })(i);
        }
        
        // chat initialisation
        if (!localStorage.isAvailable) {
            document.getElementById("chat").innerHTML = '<div class="container"><div class="row"><h2 class="headline">No chatbox available</h2></div></div>';
        }
        
        $scope.addActivityDb = function () {
            
            // block event if the input field (name of activity) doesn't match the Regular Expression
            var regularExpression = new RegExp("^[a-zA-Z\\s]*$");
            if (!regularExpression.test($scope.activityName))
                return;

            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
            
            /*var feeling = $('.feelings input:radio:checked').val()*/
            
            
            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                
                
                if ($scope.activityName) {
                    //activityModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    activityModel.id = new Date().getTime() + "-" + $cookies.get("user");
                    activityModel.activityName = $scope.activityName;
                    activityModel.feeling = $scope.feeling;
                    activityModel.latitude = lat;
                    activityModel.longitude = lng;
                    activityModel.timestamp = new Date().toLocaleDateString();
                    //activityModel.author = $rootScope.loggedInUser;
                    activityModel.author = $cookies.get("user");

                    client.addActivity(activityModel, function (error, activity) {
                        //addActivityToMap(error, activity);
                        console.log("activity added");
                        $("#activity").val("");
                    });
                } else {
                    shareModel.activityId = 0;
                    shareModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    shareModel.feeling = $scope.feeling;
                    shareModel.latitude = lat;
                    shareModel.longitude = lng;
                    shareModel.timestamp = new Date().toLocaleDateString();
                    //shareModel.author = $rootScope.loggedInUser;
                    shareModel.author = $cookies.get("user");

                    client.addShare(shareModel, function (error, share) {
                        console.log("share added")
                    });

                }

            }
        };


        $scope.sendMessage = function () {
            // TODO: get selected user (li with id == socketId)
            // TODO: get message typed by user
            // TODO: send message to this user
            // TIP: only send when a user is selected
            
            var message = $scope.message;
            chat.messages[chat.selectedUser].currentUser.push(message);

            chat.addMessageToChat(chat.selectedUser);
            var messagesInput = document.getElementById("messages");
            messagesInput.value = "";
            client.sendMessage(message, chat.selectedUser, function (error, message) {
                if(error) { console.log(error); }
                console.log(message);
            });
        };

        $scope.logout = function () {
            $cookies.remove("user");
            $rootScope.loggedInUser = null;
            $location.path("/");
        };
        
        $scope.changeMap = function () {
            var target = event.target || event.srcElement || event.originalTarget;
            mapType.changeMapType(target.id);
        };
    };
    
    app.controller("MainController", ["$scope", "$rootScope", "$location","$cookies", MainController]);
})();


(function () {
    var app = angular.module("app");
    
    var MainController = function ($scope, $rootScope, $location, $cookies) {

        
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

        $(".btn-submit").click(function () {
            $("#" + $scope.feeling).removeClass("active");
        });
        
        // chat initialisation
        if (!localStorage.isAvailable) {
            document.getElementById("chat").innerHTML = '<div class="container"><div class="row"><h2 class="headline">No chatbox available</h2></div></div>';
        }
        
        $scope.addActivityDb = function () {


            var lat, lng;
            var location = navigator.geolocation.getCurrentPosition(getPosition, showError);
            
            /*var feeling = $('.feelings input:radio:checked').val()*/
            
            
            function getPosition(position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                
                
                if ($scope.activityName) {
                    //activityModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    activityModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    activityModel.activityName = $scope.activityName;
                    activityModel.feeling = $scope.feeling;
                    activityModel.latitude = lat;
                    activityModel.longitude = lng;
                    activityModel.timestamp = new Date().toLocaleDateString();
                    activityModel.author = $rootScope.loggedInUser;
                    //activityModel.author = $cookies.get("user");

                    client.addActivity(activityModel, function (error, activity) {
                        //addActivityToMap(error, activity);
                        if(error){
                            var feedback = $("#activity-feedback");
                            feedback.addClass("error-msg");
                            feedback.html("Something went wrong! Please try again later");
                            feedback.animate({
                                opacity: 1
                            }, 500);
                            feedback.css("display", "block");
                            $("html").click(function () {
                                feedback.css("display", "none");
                            });
                            $("#activity").val("");
                        }else{
                            console.log("activity added");
                            var feedback = $("#activity-feedback");
                            feedback.removeClass("error-msg");
                            feedback.addClass("success-msg");
                            feedback.html("Thanks for sharing!");
                            feedback.animate({
                                opacity: 1
                            }, 500);
                            feedback.css("display", "block");
                            $("html").click(function () {
                                feedback.css("display", "none");
                            });
                            $("#activity").val("");
                        }
                    });
                } else {
                    shareModel.activityId = 0;
                    shareModel.id = new Date().getTime() + "-" + $rootScope.loggedInUser;
                    shareModel.feeling = $scope.feeling;
                    shareModel.latitude = lat;
                    shareModel.longitude = lng;
                    shareModel.timestamp = new Date().toLocaleDateString();
                    shareModel.author = $rootScope.loggedInUser;
                    //shareModel.author = $cookies.get("user");

                    client.addShare(shareModel, function (error, share) {
                        if(error){
                            var feedback = $("#activity-feedback");
                            feedback.addClass("error-msg");
                            feedback.html("Something went wrong! Please try again later");
                            feedback.animate({
                                opacity: 1
                            }, 500);
                            feedback.css("display", "block");
                            $("html").click(function () {
                                feedback.css("display", "none");
                            });
                            console.log(error);
                        }else{
                            var feedback = $("#activity-feedback");
                            feedback.removeClass("error-msg");
                            feedback.addClass("success-msg");
                            feedback.html("Thanks for sharing!");
                            feedback.animate({
                                opacity: 1
                            }, 500);
                            feedback.css("display", "block");
                            console.log("share added");
                            $("html").click(function () {
                                feedback.css("display", "none");
                            });

                            createMap.getData();
                        }
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
            
            // disconnect client
            client.disconnect();

            // remove admin rights
            client.isAdmin = false;
            var button = document.querySelector('button[id^="btnDelete_"]'); // any opened info-windows
            if (button !== null) button.style.display = "none";

            // remove local user storage
            localStorage.token = undefined;
            localStorage.isAvailable = undefined; // chatbox
            localStorage.hash = undefined;
            localStorage.username = undefined;

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


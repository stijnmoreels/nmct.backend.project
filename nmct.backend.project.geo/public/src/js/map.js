/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Arne Tesch
 * @language: Javascript
 * @purpose: Client Side Google Maps Integration
 =============================================================================*/

var markers = [];
var contentString = "";
var previousShareId = "";
var map;

var createMap = (function () {

    var initialize = function (element) {
        var mapCanvas = document.getElementById(element);
        var mapOptions = {
            center: {lat: 50.824683, lng: 3.25141},
            zoom: 8,
            mapTypeControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
    };

    var getData = function () {
        client.connectAnonymous(function (error, user) {
            if (error) {
                console.log(error)
            }
            else {
                getInformationForTheMap();
            }
        });
    };

    var getInformationForTheMap = function () {
        // get signed shares (related to an activity)
        client.getAllGeneric("signedshares", function (error, shares) {
            if (error) {
                console.log(error);
            }
            for (var i = 0, l = shares.length; i < l; i++) {
                var share = shares[i],
                    shareActivity = share.activityId + "";
                // "allSignedShares" is a global variable
                if (allSignedShares[shareActivity] === undefined) {
                    allSignedShares[shareActivity] = [];
                }
                allSignedShares[shareActivity].push(share);
            }
            // get activities from database
            client.getAllGeneric("activities", function (error, activities) {
                if (error) {
                    console.log(error);
                }
                else {
                    for (var i = 0, l = activities.length; i < l; i++) {
                        addActivityToMap(null, activities[i]);
                    }
                }
            });
        });

        // get unsigned shares (not related to an activity)
        client.getAllGeneric("unsignedshares", function (error, shares) {
            if (error) {
                console.log(error);
            }
            for (var i = 0, l = shares.length; i < l; i++) {
                var author = shares[i].author;
                if (allUnsignedShares[author] === undefined)
                    allUnsignedShares[author] = [];
                allUnsignedShares[author].push(shares[i]);
            }
            for (var i = 0, l = shares.length; i < l; i++) {
                addUnsignedShareToMap(null, shares[i]);
            }


        });
    };

    var addShareToMap = function (error, share) {
        if (share.activityId == 0) {
            addUnsignedShareToMap(error, share);
        } else {
            // Check if the previousShareId is the new Share
            if (share.id !== previousShareId) {
                previousShareId = share.id;
                var marker = markers[share.activityId]; // get marker for the given "activityId"
                var badge = document.getElementById("badge_" + share.activityId + "_" + share.feeling); // get the right badge in the infowindow
                var innerValue = parseInt(badge.innerHTML);
                badge.innerHTML = isNaN(innerValue) || innerValue === 0 ? 1 : ++innerValue; // set the new value to the badge
            }
        }
    };

    var addUnsignedShareToMap = function (error, share) {
        var marker = new google.maps.Marker({
            position: {lat: share.latitude, lng: share.longitude},
            icon: '../images/' + share.feeling + '-pin.png',
            map: map
        });

        var userShares = allUnsignedShares[share.author];
        var contentStringShare = '<div id="iw-container" class="container">' +
            '<div class="row">' +
            '<h1 class="iw-title">' + share.author + '</h1>' +
            '<canvas id="feelings-chart"></canvas>' +
            '</div>' +
            '</div>';


        var infoWindow = new google.maps.InfoWindow({
            content: contentStringShare
        });

        var feelings = {"happy": 0, "sad": 0, "excited": 0, "tender": 0, "angry": 0, "scared": 0};
        if (userShares !== undefined) {
            for (var i = 0, l = userShares.length; i < l; i++) {
                feelings[userShares[i].feeling]++;
            }
        }

        var data = {
            labels: ["Happy", "Excited", "Tender", "Scared", "Sad", "Angry"],
            datasets: [
                {
                    label: "Feelings",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [feelings["happy"], feelings["excited"], feelings["tender"], feelings["scared"], feelings["sad"], feelings["angry"]]
                }
            ]
        };

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            var ctx = document.getElementById("feelings-chart").getContext("2d");
            var myLineChart = new Chart(ctx).Line(data);

        });
    };

    var addActivityToMap = function (error, activity) {
        var marker = new google.maps.Marker({
            position: {lat: activity.latitude, lng: activity.longitude},
            icon: '../images/activity_pin@xs.png',
            map: map
        });

        marker.set("id", activity.id);
        markers[activity.id] = marker;

        // find out how much shares each feeling has in this activity
        var feelings = {"happy": 0, "sad": 0, "excited": 0, "tender": 0, "angry": 0, "scared": 0};
        var shares = allSignedShares[activity.id];
        if (shares !== undefined)
            for (var i = 0, l = shares.length; i < l; i++) {
                feelings[shares[i].feeling]++;
            }


        createActivityWindow(activity, marker, feelings);
    };

    var deleteActivityFromMap = function (error, activityId) {
        if (error) {
            console.log(error);
        }
        var marker = markers[activityId];
        marker.setMap(null);
    };

    function createActivityWindow(activity, marker, feelings) {
        // Infowindow HTML
        contentString =
            '<div id="iw-container" class="container">' +
            '<div class="row">' +
            '<h1 class="iw-title">' + activity.activityName + '</h1>' +
            '<div class="col-sm-5 col-xs-4">' +
            '<div class="list-group">' +
            '<button id="btn' + activity.id + '_happy" value="happy" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/happy@xs.png" alt="happy">' +
            '<span class="feeling-text">Happy </span>' +
            ' <span class="badge share-count" id="badge_' + activity.id + '_happy">' + feelings["happy"] + '</span>' +
            '</button>' +
            '<button id="btn' + activity.id + '_excited" value="excited" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/excited@xs.png" alt="excited">' +
            '<span class="feeling-text">Excited</span>' +
            ' <span class="badge share-count" id="badge_' + activity.id + '_excited">' + feelings["excited"] + '</span>' +
            '</button>' +
            '<button id="btn' + activity.id + '_tender" value="tender" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/tender@xs.png" alt="tender">' +
            '<span class="feeling-text">Tender</span>' +
            '<span class="badge share-count" id="badge_' + activity.id + '_tender">' + feelings["tender"] + '</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '<div class="col-sm-5 col-xs-4">' +
            '<div class="list-group feelings-right">' +
            '<button id="btn' + activity.id + '_scared" value="scared" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/scared@xs.png" alt="scared">' +
            '<span class="feeling-text">Scared</span>' +
            '<span class="badge share-count" id="badge_' + activity.id + '_scared">' + feelings["scared"] + '</span>' +
            '</button>' +
            '<button id="btn' + activity.id + '_sad" value="sad" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/sad@xs.png" alt="sad">' +
            '<span class="feeling-text">Sad</span>' +
            '<span class="badge share-count" id="badge_' + activity.id + '_sad">' + feelings["sad"] + '</span>' +
            '</button>' +
            '<button id="btn' + activity.id + '_angry" value="angry" class="list-group-item feeling-btn">' +
            '<img class="feeling-icon" src="./images/angry@xs.png" alt="angry">' +
            '<span class="feeling-text">Angry</span>' +
            '<span class="badge share-count" id="badge_' + activity.id + '_angry">' + feelings["angry"] + '</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="alert alert-success alert-dismissable " id="feedback" role="alert">' +
            '<span id="feedback-msg"></span>' +
            '<button class="close-alert">&times;</button>' +
            '</div>' +
            '<button ng-show="isAdmin" style="display:none;" id="btnDelete_' + activity.id + '" class="btn btn-danger" >Delete</button>' +
            '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

        google.maps.event.addListener(infoWindow, 'domready', function () {

            // set click listener for each feeling (for each infowindow)
            var feelings = ["happy", "excited", "tender", "sad", "scared", "angry"];
            for (var i = 0, l = feelings.length; i < l; i++) {
                (function (i) {
                    // Click listener for button within infowindow
                    document.getElementById("btn" + activity.id + "_" + feelings[i]).addEventListener("click", function (e) {
                        addShareClickListener(feelings[i], activity);
                    });
                })(i);
            }

            var button = document.querySelector('button[id^="btnDelete_' + activity.id + '"]');
            button.style.display = !client.isAdmin ? "none" : "block";


            // admin only
            document.getElementById("btnDelete_" + activity.id).addEventListener("click", function (e) {
                client.deleteActivity(activity.id, function (error, activityId) {
                    console.log("delete activity");
                });
            });

            // check if the user already has a share in the activity
            // if so ? return that share
            getUserSharesForActivity(localStorage.username, activity.id, function (error, share) {
                if (error) console.log(error);
            });
        });

    }


    var getUserSharesForActivity = function (username, activityId, callback) {
        var shares = allSignedShares[activityId];
        if (shares === undefined || shares.length <= 0) {
            callback("No shares found", null);
        } else {
            for (var i = 0, l = shares.length; i < l; i++)
                if (shares[i].author === username)
                // share found
                    break;
            callback(null, shares[i]);
        }
    };

    var addShareClickListener = function (feeling, activity) {

        var activityID = activity.id;
        //document.getElementById("activityID").value = activityID;

        // Check if this activity already has a share for this user
        getUserSharesForActivity(localStorage.username, activityID, function (error, share) {
            if (error) {
                console.log(error);
            }
            if (share === null || share === undefined) {
                // No share found
                var lat, lng;
                var location = navigator.geolocation.getCurrentPosition(getPosition, showError);

                function getPosition(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;

                    // Register ShareModel
                    shareModel.id = new Date().getTime() + "-" + localStorage.username;
                    shareModel.feeling = feeling;
                    shareModel.latitude = lat;
                    shareModel.longitude = lng;
                    shareModel.timestamp = new Date().toLocaleDateString();
                    shareModel.author = localStorage.username;
                    shareModel.activityId = activityID;


                    // Add share to database
                    client.addShare(shareModel, function (error, share) {

                        var infowindow = $("#iw-container");
                        var feedback = $("#feedback");
                        var feedback_msg = $("#feedback-msg");

                        infowindow.animate({
                            "height": 237
                        }, 500);
                        feedback.css("display", "block");
                        var close_alert = $(".close-alert");

                        if (error) {
                            console.log(error);
                            feedback.addClass("share-failed");
                            feedback_msg.html("An error occured!");
                            $(".share-failed").animate({
                                opacity: 1
                            }, 750);
                            close_alert.click(function () {
                                $(".share-failed").animate({
                                    opacity: 0
                                }, 750);

                                infowindow.animate({
                                    "height": 205
                                }, 500);

                            });
                        } else {
                            // just a callback check, the new share will be added in the "addShareToMap" method
                            console.log('share added');
                            feedback.removeClass("share-failed");
                            feedback.addClass(" share-success");
                            feedback_msg.html("Thanks for sharing!");
                            $(".share-success").animate({
                                opacity: 1
                            }, 750);

                            close_alert.click(function () {
                                $(".share-success").animate({
                                    opacity: 0
                                }, 750);

                                infowindow.animate({
                                    "height": 205
                                }, 500);
                            });
                        }
                    });
                }
            } else {
                var infowindow = $("#iw-container");
                var feedback = $("#feedback");
                var feedback_msg = $("#feedback-msg");
                var close_alert = $(".close-alert");

                infowindow.animate({
                    "height": 237
                }, 500);
                feedback.css("display", "block");

                console.log(error);
                feedback.addClass("share-failed");
                feedback_msg.html("An error occured!");
                $(".share-failed").animate({
                    opacity: 1
                }, 750);
                close_alert.click(function () {
                    $(".share-failed").animate({
                        opacity: 0
                    }, 750);

                    infowindow.animate({
                        "height": 205
                    }, 500);

                });
            }
        });
    };


    return {
        initialize: initialize,
        addShareToMap: addShareToMap,
        addUnsignedShareToMap: addUnsignedShareToMap,
        addActivityToMap: addActivityToMap,
        deleteActivityFromMap: deleteActivityFromMap,
        getData: getData,
        getUserSharesForActivity: getUserSharesForActivity
    }
})();


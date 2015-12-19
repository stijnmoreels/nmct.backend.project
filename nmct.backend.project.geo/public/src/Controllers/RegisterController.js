(function () {
    var app = angular.module("app");

    var RegisterController = function ($scope, $location, $rootScope) {

        $rootScope.loggedInUser = null;

        //toggle show/hide password
        // Example 2
        $('#password').hideShowPassword({
            // Make the password visible right away.
            show: false,
            // Create the toggle goodness.
            innerToggle: true,
            // Give the toggle a custom class so we can style it
            // separately from the previous example.
            toggleClass: 'my-toggle-class',
            // Don't show the toggle until the input triggers
            // the 'focus' event.
            hideToggleUntil: 'focus',
            // Enable touch support for toggle.
            touchSupport: Modernizr.touch
        });


        $scope.userRegister = function () {
            // block event if the input fields doesn't match the Regular Expression
            var regularExpression = new RegExp("^[a-zA-Z]*$");
            if (!(regularExpression.test($scope.fname)) || !(regularExpression.test($scope.lname)))
                return;
            var username = $scope.lname + "" + $scope.fname;

            var isAvailable = $scope.chatbox;
            if(!isAvailable){
                isAvailable = false;
            }else{
                isAvailable = true;
            }

            client.register($scope.lname, $scope.fname, username, $scope.password, isAvailable, function (error, user) {
                if(error){
                   console.log(error);
               }else{
                   $rootScope.loggedInUser = username;
                   client.login(username, $scope.password, function (error, user) {
                       location.href = "/#/main";
                   });
               }
            });
        }

    };

    app.controller("RegisterController",["$scope", "$location","$rootScope", RegisterController]);
})();
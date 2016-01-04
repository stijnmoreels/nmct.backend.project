var directives = angular.module('app');


directives.directive('passwordToggle', function ($compile) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem, attrs) {
            scope.tgl = function () {
                elem.attr('type', (elem.attr('type') === 'text' ? 'password' : 'text'));
            }
            var lnk = angular.element('<a data-ng-click="tgl()"><i class="glyphicon glyphicon-eye-open"></i></a>');
            $compile(lnk)(scope);
            elem.wrap('<div class="password-toggle"/>').after(lnk);
        }
    }
});
var dashboardApp = null;

(function () {
    'use strict';

    // Define the 'dashboardApp' module
    dashboardApp = angular.module('dashboardApp', [
      'dashboard'
    ]);

    // afterRender directive
    // source: http://gsferreira.com/archive/2015/03/angularjs-after-render-directive/
    // TODO: figure out why this doesn't work as written. Should be able to pass function, not hard-code it.

    angular.module('dashboardApp')
        .directive('afterRender', ['$timeout', function ($timeout) {
            var def = {
                restrict: 'A',
                terminal: true,
                transclude: false,
                link: function (scope, element, attrs) {
                    //$timeout(scope.$eval(attrs.afterRender), 0);  //Calling a scoped method
                    console.log('afterRender');
                    deferCreateCharts(); // unclear why this function isn't calling the function name passed to it; for now we are hard-coding call to deferCreateCharts();
                }
            };
            return def;
        }]);

    angular.module('dashboardApp').directive('windowSize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                var tilesAcross = 1;
                var width = w.width()-32; //   -100;
                if (width > 0) {
                    tilesAcross = Math.floor(width / 216);
                }
                return {
                    'h': w.height(),
                    'w': w.width(),
                    'tilesAcross': tilesAcross,
                    'tablecolumns': tilesAcross,
                    'tablerows': 3
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                scope.tilesAcross = newValue.tilesAcross;
                scope.tablecolumns = newValue.tilesAcross;
                scope.tablerows = 3;
                scope.style = function () {
                    return {
                        'height': (newValue.h - 32) + 'px',
                        'width': (newValue.w - 32) + 'px',
                        'tilesAcross': newValue.tilesAcross,
                        'tablecolumns': tilesAcross,
                        'tablerows': 3
                    };
                };
                var ctrl = angular.element('#dashboard').scope().$$childHead.$ctrl;
                ctrl.computeLayout();
                deferCreateCharts();
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    })

    // Define the dashboard module
    angular.module('dashboard', [
      'dashboard'
    ]);

})();
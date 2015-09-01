angular.module('appCommon', []);

angular.module('appCommon').directive('match', match);

function match($parse) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                if (console && console.warn) {
                    console.warn('Match validation requires ngModel to be on the element');
                }
                return;
            }

            var matchGetter = $parse(attrs.match);

            scope.$watch(getMatchValue, function () {
                ctrl.$validate();
            });

            ctrl.$validators.match = function () {
                return ctrl.$viewValue === getMatchValue();
            };

            function getMatchValue() {
                var match = matchGetter(scope);
                if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}

angular.module('appCommon').filter('myCurrency', ['$filter', function ($filter) {
    return function (input) {
        input = parseFloat(input);

        if (input % 1 === 0) {
            input = input.toFixed(0);
        }
        else {
            input = input.toFixed(2);
        }

        return '$' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
}]);

angular.module('appCommon', [])
    .directive('flexible', function() {
        return{
            restrict:"A",
            link:function(scope, element, attr) {
                alert(element);
                 var width=$(element).parent().width();
                 width=width+$(element).width()+20;
                 $(element).parent().width(width);
            }
        }
    });

angular.module("appCommon", [])
    .directive("starRating", function () {
        return {
            restrict: "A",
            template: "<img ng-repeat='star in stars' ng-class='starClass(star, $index)' ng-click='toggle($index)'>",
            scope: {
                ratingValue: "=",
                max: "=",
                onRatingSelected: "&"
            },
            link: function (scope, elem, attrs) {

                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        var obj={filled:false};
                        if(i < scope.ratingValue)
                        {
                            obj['filled']=true;
                        }
                        scope.stars.push(obj);
                    }
                };

                scope.starClass = function (/** Star */ star, /** Integer */ idx) {
                    var starClass = 'not-filled';
                    if (star.filled) {
                        starClass = 'filled';
                    }
                    return starClass;
                };

                scope.toggle = function (index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };
                scope.$watch("ratingValue", function (oldVal, newVal) {
                    updateStars();
                });
            }
        };
    });

'use strict';



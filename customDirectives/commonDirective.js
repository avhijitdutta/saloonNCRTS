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

    angular.module('appCommon')
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
        angular.module("appCommon")
            .directive('ngEnter', function() {
                return function(scope, element, attrs) {
                    element.bind("keydown keypress", function(event) {
                        if(event.which === 13) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                            });

                            event.preventDefault();
                        }
                    });
                };
        });

        var HorizontalScrollFix = (function() {
            function HorizontalScrollFix($timeout, $ionicScrollDelegate) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var mainScrollID = attrs.horizontalScrollFix,
                            scrollID = attrs.delegateHandle;

                        var getEventTouches = function(e) {
                            return e.touches && (e.touches.length ? e.touches : [
                                {
                                    pageX: e.pageX,
                                    pageY: e.pageY
                                }
                            ]);
                        };

                        var fixHorizontalAndVerticalScroll = function() {
                            var mainScroll, scroll;
                            mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
                            scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();

                            // patch touchstart
                            scroll.__container.removeEventListener('touchstart', scroll.touchStart);
                            scroll.touchStart = function(e) {
                                var startY;
                                scroll.startCoordinates = ionic.tap.pointerCoord(e);
                                if (ionic.tap.ignoreScrollStart(e)) {
                                    return;
                                }
                                scroll.__isDown = true;
                                if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
                                    scroll.__hasStarted = false;
                                    return;
                                }
                                scroll.__isSelectable = true;
                                scroll.__enableScrollY = true;
                                scroll.__hasStarted = true;
                                scroll.doTouchStart(getEventTouches(e), e.timeStamp);
                                startY = mainScroll.__scrollTop;

                                // below is our changes to this method
                                // e.preventDefault();

                                // lock main scroll if scrolling horizontal
                                $timeout((function() {
                                    var animate, yMovement;
                                    yMovement = startY - mainScroll.__scrollTop;
                                    if (scroll.__isDragging && yMovement < 2.0 && yMovement > -2.0) {
                                        mainScroll.__isTracking = false;
                                        mainScroll.doTouchEnd();
                                        animate = false;
                                        return mainScroll.scrollTo(0, startY, animate);
                                    } else {
                                        return scroll.doTouchEnd();
                                    }
                                }), 100);
                            };
                            scroll.__container.addEventListener('touchstart', scroll.touchStart);
                        };
                        $timeout(function() { fixHorizontalAndVerticalScroll(); });
                    }
                };
            }

            return HorizontalScrollFix;

        })();

        angular.module("appCommon").directive('horizontalScrollFix', ['$timeout', '$ionicScrollDelegate', HorizontalScrollFix])
        .directive('imagePlaceholder', function ($window) {

            return function (scope, elem, attr) {

                var image = angular.element($window.document.createElement('img'));
                image.attr('src', attr.imageSource);
                image.addClass('ng-hide');
                $window.document.body.appendChild(image[0]);

                elem.attr('src', attr.imagePlaceholder);

                image.on('load', function () {
                    console.log(image.attr('src'));
                    elem.attr('src', image.attr('src'));
                });

            };

        });
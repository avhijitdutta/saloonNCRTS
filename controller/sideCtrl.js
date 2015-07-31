app.controller('sideCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
    $scope.toggleMenuleft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showFiler = function() {
        $ionicSideMenuDelegate.toggleRight();
    }
}])


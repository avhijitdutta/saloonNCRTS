app.controller('saloonSideCtrl',['$scope','$ionicSideMenuDelegate','$rootScope','userService',function($scope,$ionicSideMenuDelegate,$rootScope,userService){
    $scope.toggleMenuleft = function(value) {
        $ionicSideMenuDelegate.toggleLeft();
        if(value && value=='logout'){
            $rootScope.logout();
        }
    };
    $scope.userDetail=userService.getData('loginData')['user_details'];
    console.log($scope.userDetail);
}])



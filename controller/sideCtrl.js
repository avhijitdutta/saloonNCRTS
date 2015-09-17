app.controller('sideCtrl',['$scope','$ionicSideMenuDelegate','userService','$state','$location','$rootScope','$ionicLoading','localFactory',function($scope,$ionicSideMenuDelegate,userService,$state,$location,$rootScope,$ionicLoading,localFactory){

    /*userService.setData(settingData,'settingData');*/
    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
        if(!states.fromCache){

        }

    });

    $scope.$on("$ionicView.afterEnter", function( scopes, states ) {
        $ionicLoading.hide();
    });

    if(userService.getData('loginData')!=null){
        $scope.userDetail=userService.getData('loginData')['user_details'];
        $rootScope.userProfilePic=$scope.userDetail.img_url;
    }

}])


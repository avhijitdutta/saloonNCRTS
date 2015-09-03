app.controller('sideCtrl',['$scope','$ionicSideMenuDelegate','userService','settingData','$state','$location','$rootScope','listPostData','$filter',function($scope,$ionicSideMenuDelegate,userService,settingData,$state,$location,$rootScope,listPostData,$filter){

    userService.setData(settingData,'settingData');
    $scope.toggleMenuleft = function(value) {
        $ionicSideMenuDelegate.toggleLeft();
        if(value && value=='logout'){

            $rootScope.logout();
        }
    };

    $scope.showFiler = function() {
        $ionicSideMenuDelegate.toggleRight();
    }

    $scope.userDetail=userService.getData('loginData')['user_details'];
    console.log($scope.userDetail);
   var defaultValue={
        latitude:"",
        longitude:"",
        category_id:"",
        user_id:"",
        sort_by:1,
        filter_by_date:$filter('date')(new Date(), 'yyyy-MM-dd'),
        start_time:{
            label: "08:00 AM",
            value: "08:00"
        },
        end_time:{
            label: "10:00 PM",
            value: "22:00"
        },
        start_price:{label:'Select',value:0},
        end_price:{label:'Select',value:0},
        city_id:0,
        locality_id:0
    }
    listPostData.setData(defaultValue);
}])


app.controller('todaysCtrl',['$scope','todaysDeal','userService','$state','$rootScope','HardwareBackButtonManager','$ionicLoading',function($scope,todaysDeal,userService,$state,$rootScope,HardwareBackButtonManager,$ionicLoading){
    HardwareBackButtonManager.disable();

    if(userService.getData('loginData')!=null){
        $rootScope.showFilter=true;
    }else{
        $rootScope.showFilter=false;
    }

    $scope.todaysDeals=todaysDeal.deal_data;
    if(userService.getData('loginData') && userService.getData('loginData').user_details.user_no)
    {
        $rootScope.showFilter=true;
    }

    $scope.dealDetail=function(value){
        userService.setData(value,'deal');
        $state.go('dealDetail',{id:value.id});
    }

    $rootScope.userAppointment=todaysDeal.upcoming_appointment;
    console.log($rootScope.userAppointment);
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $ionicLoading.hide();
    });
}])

app.controller('confirmCtrl',['$scope','userService','$stateParams','localFactory','$ionicLoading','$state',function($scope,userService,$stateParams,localFactory,$ionicLoading,$state){
    $scope.headerName="Booking";
    $scope.appointmentData=userService.getData('currentSeleted');
    console.log($scope.appointmentData);
    $scope.submit=function(){
        var obj=$scope.appointmentData['confirm'];
        $ionicLoading.show();
        var settingData = localFactory.post('book_appointment', obj);
        settingData.success(function (data) {
            localFactory.toast(data.msg);
            $state.go('tab.todaysdeals');
            $ionicLoading.hide();
        });

        settingData.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }
}])

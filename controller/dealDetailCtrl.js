app.controller('dealDetailCtrl',['$scope','userService','$state',function($scope,userService,$state){
    $scope.hideHome=true;
    $scope.dealDetail=userService.getData('deal');
    console.log($scope.dealDetail)
    //$scope.headerName=$scope.dealDetail.facility_name;
    $scope.headerName='Special offer details';

    $scope.shopNow=function(){
        var data={services:[$scope.dealDetail]};
        userService.setData(data,'currentSeleted');
        $state.go("appointment", { id: $scope.dealDetail.saloon_id });
    }
}])

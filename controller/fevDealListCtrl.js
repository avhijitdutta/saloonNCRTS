app.controller('fevDealListCtrl',['$scope','todaysDeal','userService','$state','$rootScope','$ionicLoading','localFactory',function($scope,todaysDeal,userService,$state,$rootScope,$ionicLoading,localFactory){
    $scope.dealDetail=function(value){
        userService.setData(value,'deal');
        $state.go('dealDetail',{id:value.id,type:1});
    }

    $scope.todaysDeals=todaysDeal.deal_data;
    console.log($scope.todaysDeals);
    $scope.headerName="Bookmarked Offers";
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $ionicLoading.hide();
    });

    $scope.toggleFev=function(isFev,id){
        if(userService.getData('loginData')){
            for(var i=0;i<$scope.todaysDeals.length;i++){
                if($scope.todaysDeals[i]['id']==id){
                    var is_fev;
                    if(parseInt(isFev))
                    {
                        is_fev=0;

                    }else{

                        is_fev=1;
                    }

                    $ionicLoading.show();
                    var obj={deal_id:id,user_id:userService.getData('loginData').user_details.user_no,is_fev:is_fev}
                    var settingData = localFactory.post('set_fev_deal', obj);
                    settingData.success(function (data) {
                        $ionicLoading.hide();
                        $scope.todaysDeals[i]['is_fev']=is_fev;

                    });
                    settingData.error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                    });

                    break;
                }
            }
        }else{
            localFactory.toast('Login to enjoy the benefits of app.');
            $state.go('login');
        }
    }
}])

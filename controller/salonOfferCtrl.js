app.controller('salonOfferCtrl', ['$scope','userService','$state','$rootScope','$ionicLoading','$ionicModal','localFactory','$filter','listPostData',function($scope,userService,$state,$rootScope,$ionicLoading,$ionicModal,localFactory,$filter){
    $scope.loading=true;
    $scope.headerName="My Offers"
    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
        console.log(states);
        if(!states.fromCache){
            $scope.showList();
        }
    });

    $scope.saloon_id=userService.getData('loginData')['user_details']['saloon_id'];
    console.log($scope.userDetail);
    $scope.$on("$ionicView.afterEnter", function( scopes, states ) {
        $ionicLoading.hide();
    });



    $scope.dealDetail=function(value){
        userService.setData(value,'deal');
        $state.go('dealDetail',{id:value.id,type:2});
    }


    $scope.showList=function(itemId){
        $ionicLoading.show();
        var postData={};
        if(userService.getData('loginData') && userService.getData('loginData')!=null){
            postData['user_no']=userService.getData('loginData').user_details.user_no;
        }

        postData['current_time']=$filter('date')(new Date(),'HH:mm:ss');
        postData['current_date']=$filter('date')(new Date(),'yyyy-MM-dd');
        /*postData['saloon_id']= $scope.saloon_id;*/

        var settingData = localFactory.post('todays_deal', postData);
        settingData.success(function (data) {
            $scope.loading=false;
            $ionicLoading.hide();
            $scope.todaysDeals=data.deal_data;
            $rootScope.userAppointment=data.upcoming_appointment;
        });

        settingData.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }

    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $ionicLoading.hide();
    });

}])

app.controller('todaysCtrl',['$scope','todaysDeal','userService','$state','$rootScope','HardwareBackButtonManager','$ionicLoading','$ionicModal','localFactory','$filter',function($scope,todaysDeal,userService,$state,$rootScope,HardwareBackButtonManager,$ionicLoading,$ionicModal,localFactory,$filter){
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

    $ionicModal.fromTemplateUrl('view/categoryModal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });


    $scope.openModal = function() {
        console.log('Opening Modal');
        $scope.modal.show();
    };

    console.log(userService.getData('settingData').service);
    $scope.cateList=userService.getData('settingData')['service'];
    $scope.showList=function(itemId){
        $ionicLoading.show();
        var postData={};
        if(userService.getData('loginData') && userService.getData('loginData')!=null){
            postData['user_no']=userService.getData('loginData').user_details.user_no;
            postData['current_time']=$filter('date')(new Date(),'HH:mm:ss'),
            postData['current_date']=$filter('date')(new Date(),'yyyy-MM-dd')
            postData['category_id']=itemId;
        }
        var settingData = localFactory.post('todays_deal', postData);
        settingData.success(function (data) {
            $ionicLoading.hide();
            $scope.todaysDeals=data.deal_data;
        });

        settingData.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
        $scope.modal.hide();
    }

    $rootScope.userAppointment=todaysDeal.upcoming_appointment;
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

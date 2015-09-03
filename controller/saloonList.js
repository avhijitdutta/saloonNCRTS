app.controller('saloonList',['$scope','$rootScope','saloons','listPostData','localFactory','userService','$state','$ionicLoading','$stateParams','$ionicModal','$filter',function($scope,$rootScope,saloons,listPostData,localFactory,userService,$state,$ionicLoading,$stateParams,$ionicModal,$filter){
    $scope.category_id=$stateParams.id;
    $rootScope.map=false;
    $rootScope.userAppointment=saloons.upcoming_appointment;
    $rootScope.saloonList=saloons.saloon_details;

    $scope.doRefresh = function() {
        var saloonList = localFactory.post('saloon_list',listPostData.getData());
        saloonList.success(function (data) {
            $rootScope.saloonList=data.saloon_details;
            $scope.$broadcast('scroll.refreshComplete');
        });

        saloonList.error(function (data, status, headers, config) {
            localFactory.alert("Check your internet connection.");
        });

    };

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
        var obj={category_id:itemId};
        listPostData.setData(obj);
        var saloonList = localFactory.post('saloon_list',listPostData.getData());
        saloonList.success(function (data) {
            $rootScope.saloonList=data.saloon_details;
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        });

        saloonList.error(function (data, status, headers, config) {
            localFactory.alert("Check your internet connection.");
            $ionicLoading.hide();
        });
        $scope.modal.hide();
    }

    $scope.toggleFev=function(isFev,id){
        if(userService.getData('loginData')){
            for(var i=0;i<$rootScope.saloonList.length;i++){
                if($rootScope.saloonList[i]['saloon_id']==id){

                    if(parseInt(isFev))
                    {
                        $rootScope.saloonList[i]['is_fev']=0;

                    }else{

                        $rootScope.saloonList[i]['is_fev']=1;
                    }

                    var obj={saloon_id:id,user_id:userService.getData('loginData').user_details.user_no,is_fev:$rootScope.saloonList[i]['is_fev']}
                    var settingData = localFactory.post('set_fev_saloon', obj);
                    settingData.success(function (data) {
                        $ionicLoading.hide();
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
    $ionicLoading.hide()
}])

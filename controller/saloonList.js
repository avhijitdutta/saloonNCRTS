app.controller('saloonList',['$scope','$rootScope','saloons','listPostData','localFactory','userService','$state','$ionicLoading','$stateParams',function($scope,$rootScope,saloons,listPostData,localFactory,userService,$state,$ionicLoading,$stateParams){
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

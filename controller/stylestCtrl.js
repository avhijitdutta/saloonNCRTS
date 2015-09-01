app.controller('stylestCtrl',['$scope','stylest','localFactory','userService','$stateParams','$ionicLoading',function($scope,stylest,localFactory,userService,$stateParams,$ionicLoading){
    console.log(stylest);
    $scope.headerName=stylest.stylist_info.name;
    $scope.stylest=stylest;

    $scope.favourite=function(isFev){
        var obj={expert_id:$stateParams.id,user_id:userService.getData('loginData').user_details.user_no,is_fev:$scope.stylest.is_fev};
        if(parseInt(isFev)==1)
        {
            obj['is_fev']=0;
        }else{
            obj['is_fev']=1;
        }
        var settingData = localFactory.post('set_fev_stylist', obj);
        settingData.success(function (data) {
            if(parseInt(isFev)==1)
            {
                $scope.stylest.is_fev=0;
            }else{
                $scope.stylest.is_fev=1;
            }
            $ionicLoading.hide();
        });

        settingData.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }

}])


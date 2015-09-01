app.controller('saloonFavCtrl',['$scope','$compile','saloons','userService','$state','localFactory','$ionicLoading',function($scope,$compile,saloons,userService,$state,localFactory,$ionicLoading){
    $scope.headerName="Favourite Salones";
    $scope.saloonList=saloons.saloon_details;
    $scope.saloonListFev=[];
    for(var i=0;i<$scope.saloonList.length;i++){
        if(parseInt($scope.saloonList[i]['is_fev'])==1){
            $scope.saloonListFev.push($scope.saloonList[i]);
        }
    }

    console.log( $scope.saloonListFev);
    $scope.toggleFev=function(isFev,id){

        if(userService.getData('loginData')){
            $ionicLoading.show();
            for(var i=0;i<$scope.saloonListFev.length;i++){
                if($scope.saloonListFev[i]['saloon_id']==id){

                    if(parseInt(isFev))
                    {
                        $scope.saloonListFev[i]['is_fev']=0;

                    }else{

                        $scope.saloonListFev[i]['is_fev']=1;
                    }

                    var obj={saloon_id:id,user_id:userService.getData('loginData').user_details.user_no,is_fev:$scope.saloonListFev[i]['is_fev']};
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
}])


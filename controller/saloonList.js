app.controller('saloonList',['$scope','$rootScope','listPostData','localFactory','userService','$state','$ionicLoading','$stateParams','$ionicModal','$filter','$cordovaGeolocation','$ionicHistory',function($scope,$rootScope,listPostData,localFactory,userService,$state,$ionicLoading,$stateParams,$ionicModal,$filter,$cordovaGeolocation,$ionicHistory){
    $scope.category_id=$stateParams.id;
    $scope.loading=true;
    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
        $rootScope.map=false;

        $rootScope.search=false;
        console.log(states);
        if($rootScope.previousState!='detailSaloon'){
            $scope.loading=true;
            $rootScope.saloonList="";
            var postData={
            };
            if(userService.getData('loginData')!=null){
                postData['user_id']=userService.getData('loginData').user_details.user_no;
            }
            postData['current_time']=$filter('date')(new Date(), 'HH:mm:ss');
            postData['current_date']=$filter('date')(new Date(), 'yyyy-MM-dd');

            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    postData['latitude']=position.coords.latitude;
                    postData['longitude']=position.coords.longitude;
                    postData['saloon_name']="";
                    postData['page_number']=0;
                    listPostData.setData(postData);
                    $scope.showList();
                }, function (err) {
                    $scope.loading=false;
                    localFactory.alert("Please turn on GPS on your mobile.");
                });

        }

    });

    $scope.$on("$ionicView.afterEnter", function( scopes, states ) {
        $ionicLoading.hide();
    });

    $scope.loadMore = function(value) {
        var postData={};
        postData['page_number']=parseInt(value)+1;
        listPostData.setData(postData);
        var saloonList = localFactory.post('saloon_list',listPostData.getData());
        saloonList.success(function (data) {
            var previousArray=$rootScope.saloonList.saloon_details;
            var updated=previousArray.concat(data.saloon_details);
            $rootScope.saloonList.saloon_details=updated;
            $rootScope.saloonList.page_number=data.page_number;
            $rootScope.userAppointment=data.upcoming_appointment;
            $scope.$broadcast('scroll.infiniteScrollComplete');
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

    $scope.showList=function(itemId,flag){
        var obj={};
        obj['page_number']=0;
        if(itemId){
            $ionicLoading.show();
            obj['category_id']=itemId;
        }else{
            obj['category_id']="";
        }
        listPostData.setData(obj);
        var saloonList = localFactory.post('saloon_list',listPostData.getData());
        saloonList.success(function (data) {
            $rootScope.saloonList=data;
            if(itemId){
                $scope.category_id=itemId;
            }

            $scope.loading=false;
            $rootScope.userAppointment=data.upcoming_appointment;
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        });

        saloonList.error(function (data, status, headers, config) {
            $scope.loading=false;
            localFactory.alert("Check your internet connection.");
            $ionicLoading.hide();
        });

        if(flag){
            $scope.modal.hide();
        }

    }

    $scope.toggleFev=function(isFev,id){
        if(userService.getData('loginData')){
            for(var i=0;i<$rootScope.saloonList.saloon_details.length;i++){
                if($rootScope.saloonList.saloon_details[i]['saloon_id']==id){

                    var is_fev;
                    if(parseInt(isFev))
                    {
                        is_fev=0;
                    }else{
                        is_fev=1
                    }
                    $ionicLoading.show();
                    var obj={saloon_id:id,user_id:userService.getData('loginData').user_details.user_no,is_fev:is_fev}
                    var settingData = localFactory.post('set_fev_saloon', obj);
                    settingData.success(function (data) {
                        $ionicLoading.hide();
                        $rootScope.saloonList.saloon_details[i]['is_fev']=is_fev;
                    });
                    settingData.error(function (data, status, headers, config) {
                        localFactory.toast("Check your internet connection");
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

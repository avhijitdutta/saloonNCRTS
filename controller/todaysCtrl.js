app.controller('todaysCtrl',['$scope','userService','$state','$rootScope','HardwareBackButtonManager','$ionicLoading','$ionicModal','localFactory','$filter','listPostData','$stateParams',function($scope,userService,$state,$rootScope,HardwareBackButtonManager,$ionicLoading,$ionicModal,localFactory,$filter,listPostData,$stateParams){
    HardwareBackButtonManager.disable();
    $scope.todaysDeals=[];
    $scope.loading=true;
    $scope.category_id="";
    $scope.page_number="";
    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
        console.log($rootScope.previousState);
        if($rootScope.previousState!='dealDetail'){
            $scope.loading=true;
            $scope.todaysDeals=[];
            $ionicLoading.show();
            var settingData = localFactory.post('settings', {});
            settingData.success(function (data) {
                userService.setData(data,'settingData');
                console.log(userService.getData('settingData').service);
                $scope.cateList=userService.getData('settingData')['service'];
                $scope.showList();
                $ionicLoading.hide();

            });
            settingData.error(function (data, status, headers, config) {
                $ionicLoading.hide();
            });

        }

    });

    $scope.$on("$ionicView.afterEnter", function( scopes, states ) {
        $ionicLoading.hide();
    });

    if(userService.getData('loginData')!=null){
        $rootScope.showFilter=true;
    }else{
        $rootScope.showFilter=false;
    }

    /*$scope.todaysDeals=todaysDeal.deal_data;*/
    if(userService.getData('loginData') && userService.getData('loginData').user_details.user_no)
    {
        $rootScope.showFilter=true;
    }

    $scope.dealDetail=function(value){
        userService.setData(value,'deal');
        $state.go('dealDetail',{id:value.id,type:1});
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


    $scope.showList=function(itemId,flag,page_number){
        $ionicLoading.show();
        var postData={};
        if(userService.getData('loginData') && userService.getData('loginData')!=null){
            postData['user_no']=userService.getData('loginData').user_details.user_no;
        }

        postData['current_time']=$filter('date')(new Date(),'HH:mm:ss');
        postData['current_date']=$filter('date')(new Date(),'yyyy-MM-dd');
        if(page_number){
            postData['page_number']=page_number;
        }else{
            postData['page_number']=0;
        }

        if(itemId && itemId!="nochange"){
            postData['category_id']=itemId;
        }else{
            postData['category_id']="";
        }

        if($stateParams.id){
            postData['saloon_id']=$stateParams.id;
        }

        var settingData = localFactory.post('todays_deal', postData);
        settingData.success(function (data) {
            $scope.loading=false;
            $ionicLoading.hide();
            if(flag){
                $scope.todaysDeals=[];
                $scope.modal.hide();
            }
            var previousArray=$scope.todaysDeals;
            var updated=previousArray.concat(data.deal_data);
            $scope.page_number=data.page_number;
            if(!data.page_number){
                $scope.page_number="";
            }
            $scope.todaysDeals=updated;
            $rootScope.userAppointment=data.upcoming_appointment;
            if(itemId){
                $scope.category_id=itemId;
            }

        });

        settingData.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });



    }
/*
    $rootScope.userAppointment=todaysDeal.upcoming_appointment;*/
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

    $scope.loadMore = function(value) {
        $scope.showList("nochange","",parseInt(value)+1);
    };

    $scope.showSaloons=function(){
        var defaultValue={
            latitude:"",
            longitude:"",
            category_id:"",
            user_id:"",
            sort_by:3,
            filter_by_date:$filter('date')(new Date(), 'yyyy-MM-dd'),
            start_time:{
                label: "08:00 AM",
                value: "08:00"
            },
            end_time:{
                label: "10:00 PM",
                value: "22:00"
            },
            start_price:{label:'Select',value:0},
            end_price:{label:'Select',value:0},
            city_id:0,
            locality_id:0
        }
        listPostData.setData(defaultValue);
        $state.go('sidelist.saloonList');
    }
}])

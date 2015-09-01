app.controller('sideCtrl',['$scope','$ionicSideMenuDelegate','$ionicModal','userService','settingData','$state','$location','$rootScope','listPostData','$filter',function($scope,$ionicSideMenuDelegate,$ionicModal,userService,settingData,$state,$location,$rootScope,listPostData,$filter){

    userService.setData(settingData,'settingData');
    $scope.toggleMenuleft = function(value) {
        $ionicSideMenuDelegate.toggleLeft();
        if(value && value=='logout'){

            $rootScope.logout();
        }

    };

    $scope.showFiler = function() {
        $ionicSideMenuDelegate.toggleRight();
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

   var defaultValue={
        latitude:"",
        longitude:"",
        category_id:1,
        user_id:"",
        sort_by:1,
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

    console.log(userService.getData('settingData').service);
    $scope.cateList=userService.getData('settingData')['service'];
    $scope.showList=function(itemId){
        listPostData.setData(defaultValue);
        $state.go('sidelist.saloonList', {id: itemId});
        $scope.modal.hide();
    }
}])


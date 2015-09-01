app.controller('sideListCtrl',['$scope','$ionicSideMenuDelegate','$rootScope','listPostData',"userService",'$filter','localFactory','$ionicLoading','$cordovaGeolocation',function($scope,$ionicSideMenuDelegate,$rootScope,listPostData,userService,$filter,localFactory,$ionicLoading,$cordovaGeolocation){
    $rootScope.map=true;

    $scope.toggleMenuleft = function(value) {
        if(value && value=='logout'){

            $rootScope.logout();
        }
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.postData={
        sort_by:listPostData.getData().sort_by,
        filter_by_date:listPostData.getData().filter_by_date,
        start_time:listPostData.getData().start_time,
        end_time:listPostData.getData().end_time,
        start_price:listPostData.getData().start_price,
        end_price:listPostData.getData().end_price
    }

    $scope.filterByType=[
        {id:1,class:"ion-ios-star-outline"},
        {id:2,class:"ion-social-usd-outline"},
        {id:3,class:"ion-ios-location-outline"}
    ];

    $scope.filterByDate=[{id:1,text:"Today",date:$filter('date')(new Date(), 'yyyy-MM-dd')},{id:2,text:"Tomorrow",date:$filter('date')(new Date().setDate(new Date().getDate()+1), 'yyyy-MM-dd')}];
    $scope.timeFilterArray=timeArray;
    $scope.priceFilterArray=priceArray;

    $scope.cityList=userService.getData('settingData').cities;
    $scope.localities=userService.getData('settingData').localities;
    /* add a extra value*/
    $scope.localities['0']=[
        {locality:"Location",id:"0",city_id:0}
    ];
    /*Push a extra value of citylist */
    $scope.cityList.push({city_name:"City",id:"0"});
    $scope.cityList.moveArrayPos($scope.cityList.length-1,0);

    $scope.postData['city']=$scope.cityList[0];

    $scope.locality=$scope.localities[$scope.postData.city.id];
    $scope.postData.locality=$scope.locality[0];

    $scope.typeTabChange=function(value){
        $scope.postData.sort_by=value;
    }

    $scope.isActiveType=function(active){
        return active == $scope.postData.sort_by;
    }

    $scope.dateTabChange=function(value){
        $scope.postData.filter_by_date=value.date;
    }

    $scope.isActiveDate=function(active){
        return active == $scope.postData.filter_by_date;
    }

    $scope.showFiler = function() {
        $ionicSideMenuDelegate.toggleRight();
    }

    $scope.changeCity = function (value) {
        $scope.locality=$scope.localities[value['id']];
        $scope.postData.locality=$scope.locality[0];
    }

    $scope.filterList=function(){
        $scope.postData.city_id=$scope.postData.city.id;
        $scope.postData.locality_id=$scope.postData.locality.id;

        $ionicLoading.show();

        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        if($scope.postData.sort_by==3){

            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.postData['latitude']=position.coords.latitude;
                    $scope.postData['longitude']=position.coords.longitude;
                    listPostData.setData($scope.postData);
                    var saloonList = localFactory.post('saloon_list',listPostData.getData());
                    saloonList.success(function (data) {
                        $rootScope.saloonList=data.saloon_details;
                        $ionicLoading.hide();
                    });

                    saloonList.error(function (data, status, headers, config) {
                        localFactory.alert("Check your internet connection.")
                    });

                }, function (err) {
                    $ionicLoading.hide();
                    localFactory.alert("Please turn on GPS on your mobile.");
                });

        }else{
            listPostData.setData($scope.postData);
            var saloonList = localFactory.post('saloon_list',listPostData.getData());
            saloonList.success(function (data) {
                $rootScope.saloonList=data.saloon_details;
                $ionicLoading.hide();
            });

            saloonList.error(function (data, status, headers, config) {
                localFactory.alert("Check your internet connection.")
                $ionicLoading.hide();
            });
        }


        $ionicSideMenuDelegate.toggleRight();
    }
}])

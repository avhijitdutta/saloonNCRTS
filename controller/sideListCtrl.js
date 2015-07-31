app.controller('sideListCtrl',['$scope','$ionicSideMenuDelegate','$rootScope','listPostData',function($scope,$ionicSideMenuDelegate,$rootScope,listPostData){
    $rootScope.map=true;
    $scope.toggleMenuleft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.filterByType=[{id:1,class:"ion-ios-location-outline"},{id:2,class:"ion-social-usd-outline"},{id:3,class:"ion-ios-time-outline"}];
    $scope.filterByDate=[{id:1,text:"Today"},{id:2,text:"Tomorrow"}];
    $scope.currentFilterByType=listPostData.getData().sort_by;
    $scope.currentFilterBydate=listPostData.getData().filter_by_date;

    $scope.timeFilterArray=timeArray;
    $scope.priceFilterArray=priceArray;

    $scope.start_time=listPostData.getData().start_time;
    $scope.end_time=listPostData.getData().end_time;

    $scope.start_price=listPostData.getData().start_price;
    $scope.end_price=listPostData.getData().end_price;

    $scope.typeTabChange=function(value){
        $scope.currentFilterByType=value;
    }

    $scope.isActiveType=function(active){
        return active == $scope.currentFilterByType;
    }

    $scope.dateTabChange=function(value){
        $scope.currentFilterBydate=value;
    }

    $scope.isActiveDate=function(active){
        return active == $scope.currentFilterBydate;
    }

    $scope.showFiler = function() {
        $ionicSideMenuDelegate.toggleRight();
    }

    $scope.filterList=function(){
        $ionicSideMenuDelegate.toggleRight();
        listPostData.saloonListData=listPostData.post();
    }
}])

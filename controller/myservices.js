app.controller('myservices', ['$scope','$rootScope','saloon','$ionicScrollDelegate','$ionicLoading','localFactory', function($scope,$rootScope,saloon,$ionicScrollDelegate,$ionicLoading,localFactory) {
    $scope.saloonServices=saloon.service;
    $scope.headerName="My Services";
    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
        $ionicScrollDelegate.resize();
    }

    $scope.noClick=function($event){
        $event.preventDefault();
        return false;
    }

    $scope.updatePrice=function(item){
        $ionicLoading.show();
        var postData={saloon_id:saloon.saloon_details.saloon_id,category_id:item.category_id,facility_id:item.facility_id,price:item.price};
        var updatePrice = localFactory.post('saloon_price_edit', postData);
        updatePrice.success(function (data) {
            localFactory.toast("Price Update successfully")
            $ionicLoading.hide();
        });

        updatePrice.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }
}])


app.controller('saloonMapCtrl',['$scope','$compile','$rootScope','listPostData','$ionicLoading','location','$stateParams','uiGmapGoogleMapApi',function($scope,$compile,$rootScope,listPostData,$ionicLoading,location,$stateParams,uiGmapGoogleMapApi){
    console.log($rootScope.saloonList);
    console.log(location);
    $scope.category_id=$stateParams.id;
    $rootScope.map=true;
    $scope.saloon={};
    $scope.hideSaloon=function(){
        $scope.showItem=false;
    }

    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
       $ionicLoading.show();
    });

    $scope.$on("$ionicView.afterEnter", function( scopes, states ) {
        $ionicLoading.hide();
    });

    $scope.addMarkers=function()
    {
        var markers=[];
        for(var i=0;i<$rootScope.saloonList.length;i++)
        {
            var tempData={};
            tempData['latitude']=$rootScope.saloonList[i]['latitude'];
            tempData['longitude']=$rootScope.saloonList[i]['longitude'];
            tempData['title']=i+"M";
            tempData['data']=$rootScope.saloonList[i];
            tempData.onClick = function(obj) {
                console.log(obj.model);
                $scope.showItem=true;
                $scope.saloon=obj.model.data;
                $scope.$apply()
            };
            tempData['id']=i;
            markers.push(tempData);
        }
        /*end of map*/
        $scope.randomMarkers = markers;
        console.log($scope.randomMarkers);
    }

    $scope.showItem=false;

    $scope.randomMarkers=[];
    uiGmapGoogleMapApi.then(function(maps) {
        console.log(maps);
        $scope.map = {
            center: {
                latitude:location.coords.latitude,
                longitude:location.coords.longitude
            },
            zoom: 11,
            bounds: {},
            events: {
                tilesloaded: function (maps, eventName, args) {
                    $ionicLoading.hide();
                }
            }
        };

        $scope.options = {
            scrollwheel: true
        };
    });


    $scope.addMarkers();
    $ionicLoading.hide();
}])

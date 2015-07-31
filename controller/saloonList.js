app.controller('saloonList',['$scope','$rootScope','saloons','listPostData',function($scope,$rootScope,saloons,listPostData){

    listPostData.saloonListData=saloons;
    console.log(listPostData.saloonListData.saloon_details);
    $rootScope.map=false;
    $scope.saloonList=salonList;
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.toggleFev=function(isFev,id){
        for(var i=0;i<$scope.saloonList.length;i++){
            if($scope.saloonList[i]['id']==id){
                if(isFev)
                {
                    $scope.saloonList[i]['is_fev']=false;
                }else{
                    $scope.saloonList[i]['is_fev']=true;
                }
                break;
            }
        }
    }
}])

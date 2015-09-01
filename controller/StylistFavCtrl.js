app.controller('StylistFavCtrl',['$scope','$compile','stylistList',function($scope,$compile,stylistList){
    $scope.headerName="Favourite Stylists";
    $scope.stylistList=stylistList.stylist;
    console.log($scope.stylistList);
}])



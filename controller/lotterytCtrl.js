app.controller('lotterytCtrl',['$scope','lottery',function($scope,lottery){
    $scope.headerName="Yesterday's Lottery Winner";
    $scope.lottery=lottery.winner;
    console.log($scope.lottery);
}])


app.controller('appointmentDetails',['$scope','$location','$ionicHistory','historyDetail',function($scope,$location,$ionicHistory,historyDetail){
    $scope.headerName="Appointment Details"
    $scope.historyDetail=historyDetail;
    console.log($scope.historyDetail);
}])




app.controller('appointmentDetails',['$scope','$location','$ionicHistory','historyDetail',function($scope,$location,$ionicHistory,historyDetail){
    $scope.headerName="Appointment Details";
    $scope.historyDetail=historyDetail;
    console.log($scope.historyDetail);

    $scope.subTotal=function(){
        var total=0;
        for(var i=0;i<$scope.historyDetail.service_list.length;i++){
            $scope.subTotal=parseInt($scope.subTotal)+parseInt($scope.historyDetail.service_list[i]['price'])
        }
    };



}])




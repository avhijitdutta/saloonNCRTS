app.controller('appointmentSaloonCtrl',['$scope','$location','$ionicHistory','historyDetail','localFactory','$ionicLoading',function($scope,$location,$ionicHistory,historyDetail,localFactory,$ionicLoading){
    $scope.headerName="Appointment Details";
    $scope.historyDetail=historyDetail;
    console.log($scope.historyDetail);

    $scope.subTotal=function(){
        var total=0;
        angular.forEach($scope.historyDetail.service_list, function(item) {
            total+= parseInt(item.no_of_person)*parseInt(item['price']);
        })
        return total;
    };
    $scope.confirm=function(value){
        $ionicLoading.show();
        var obj={appointment_id:$scope.historyDetail.appointment.id,saloon_id:$scope.historyDetail.appointment.saloon_id,appointment_status:value}
        var saloonList = localFactory.post('saloon_apointment_manage',obj);
        saloonList.success(function (data) {
            if(data.result)
            {
                $scope.historyDetail.appointment.appointment_status=value;
            }
            $ionicLoading.hide();
        });

        saloonList.error(function (data, status, headers, config) {
            $ionicLoading.hide();
            localFactory.alert("Check your internet connection.");
        });
    }

    $scope.callNumber=function(number){
        window.open('tel:'+number, '_system')
    }
}])





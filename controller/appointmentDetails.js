app.controller('appointmentDetails',['$scope','$location','$ionicHistory','historyDetail','localFactory','userService','$state','$ionicPopup','$ionicLoading',function($scope,$location,$ionicHistory,historyDetail,localFactory,userService,$state,$ionicPopup,$ionicLoading){
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

    $scope.cancel=function(){
        localFactory.confirm("Are you sure to cancel?",function(value){
            if(value){
                $scope.data = {};
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.wifi">',
                    title: 'Please enter a reason for cancellation ',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Skip',
                            onTap: function(e) {
                                $ionicLoading.show();
                                var obj={appointment_id:$scope.historyDetail.appointment.id,saloon_id:$scope.historyDetail.appointment.saloon_id,appointment_status:4}
                                var saloonList = localFactory.post('saloon_apointment_manage',obj);
                                saloonList.success(function (data) {
                                    $ionicHistory.goBack();
                                    $ionicLoading.hide();
                                });

                                saloonList.error(function (data, status, headers, config) {
                                    $ionicLoading.hide();
                                    localFactory.alert("Check your internet connection.");
                                });
                            }
                        },
                        {
                            text: '<b>Submit</b>',
                            type: 'button-assertive',
                            onTap: function(e) {
                                if($scope.data.wifi){
                                    $ionicLoading.show();
                                    var obj={appointment_id:$scope.historyDetail.appointment.id,saloon_id:$scope.historyDetail.appointment.saloon_id,appointment_status:4,cancel_reason:$scope.data.wifi};
                                    var saloonList = localFactory.post('saloon_apointment_manage',obj);
                                    saloonList.success(function (data) {
                                        $ionicHistory.goBack();
                                        $ionicLoading.hide();
                                    });

                                    saloonList.error(function (data, status, headers, config) {
                                        $ionicLoading.hide();
                                        localFactory.alert("Check your internet connection.");
                                    });

                                }else{
                                    e.preventDefault();
                                    localFactory.toast("Please enter some reason.");
                                }

                            }
                        }
                    ]
                });

            }
        })

    }

    $scope.reSchedule=function(){
        localFactory.confirm("Are you sure to reschedule?",function(value){
           if(value){
               var data={services:$scope.historyDetail.service_list,appointment_id:$scope.historyDetail.appointment.id};
               userService.setData(data,'currentSeleted');
               $state.go("appointment", { id:$scope.historyDetail.appointment.saloon_id});
           }
        })
    }

}])




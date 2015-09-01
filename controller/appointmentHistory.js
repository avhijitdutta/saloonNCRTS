app.controller('appointmentHistory',['$scope','history',function($scope,history){
    $scope.histories=history.appointment_list;
    $scope.headerName="Appointment History"
}])



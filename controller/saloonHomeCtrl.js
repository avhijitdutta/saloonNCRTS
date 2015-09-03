app.controller('saloonHomeCtrl',['$scope','$ionicSideMenuDelegate','appointments',function($scope,$ionicSideMenuDelegate,appointments){

    $scope.histories=appointments.appointment_list;
    console.log($scope.histories);
}])


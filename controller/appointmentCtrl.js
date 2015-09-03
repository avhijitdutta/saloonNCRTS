app.controller('appointmentCtrl',['$scope','userService','appointment','$filter','$state','localFactory',function($scope,userService,appointment,$filter,$state,localFactory){
    $scope.headerName="Book Service Appointment";
    $scope.appointmentData=userService.getData('currentSeleted');
    $scope.appointmentData['saloon']={saloon_details:appointment['sallon_details']};
    $scope.appointment=appointment['slot'];
    $scope.netAmount=0.00;
    $scope.taxPercentage=appointment['sallon_details']['service_tax'];
    console.log($scope.appointment[$filter('date')(new Date(), 'yyyy-MM-dd')]);
    $scope.facility_ids=[];

    for(var i=0; i<$scope.appointmentData.services.length;i++){

        $scope.appointmentData.services[i]['no_of_person']=1;
        if($scope.appointmentData.services[i]['is_deal']==1)
        {
            if($filter('date')(new Date(), 'yyyy-MM-dd') >=$scope.appointmentData.services[i]['deal_start_time'] && $filter('date')(new Date(), 'yyyy-MM-dd') <=$scope.appointmentData.services[i]['deal_end_time'])
            {
                $scope.appointmentData.services[i]['is_deal']=1;
            }else{
                $scope.appointmentData.services[i]['is_deal']=0;
            }
        }
        $scope.facility_ids.push($scope.appointmentData.services[i]);

    }

    $scope.subTotal = function(){
        var total = 0;
        angular.forEach($scope.appointmentData.services, function(item) {
            total += item.no_of_person * item.price;
        })
        return total;
    }

    $scope.discountAmount = function(){
        var total = 0;
        angular.forEach($scope.appointmentData.services, function(item) {
            if(item['is_deal']==1)
            {
                if($filter('date')(new Date(), 'yyyy-MM-dd') >=item['deal_start_time'] && $filter('date')(new Date(), 'yyyy-MM-dd') <=item['deal_end_time'])
                {
                    total +=item.no_of_person*parseFloat( item['price'] - item['deal_price']);
                }
            }
        })
        return total;
    }

    $scope.days=[
                    {name:$filter('date')(new Date(), 'dd'),date:$filter('date')(new Date(), 'yyyy-MM-dd'),id:1,hours:$scope.appointment[$filter('date')(new Date(), 'yyyy-MM-dd')],selected:true,day:$filter('date')(new Date(), 'EEE')},
                    {name:$filter('date')(new Date(new Date().getDate()+1), 'dd'),date:$filter('date')(new Date().setDate(new Date().getDate()+1), 'yyyy-MM-dd'),id:2,hours:$scope.appointment[$filter('date')(new Date().setDate(new Date().getDate()+1), 'yyyy-MM-dd')],selected:false,day:$filter('date')(new Date().setDate(new Date().getDate()+1), 'EEE')},
                    {name:$filter('date')(new Date().setDate(new Date().getDate()+2), 'dd'),date:$filter('date')(new Date().setDate(new Date().getDate()+2), 'yyyy-MM-dd'),id:3,hours:$scope.appointment[$filter('date')(new Date().setDate(new Date().getDate()+2), 'yyyy-MM-dd')],selected:false,day:$filter('date')(new Date().setDate(new Date().getDate()+2), 'EEE')},
                    {name:$filter('date')(new Date().setDate(new Date().getDate()+3), 'dd'),date:$filter('date')(new Date().setDate(new Date().getDate()+3), 'dd MMM'),id:4,hours:$scope.appointment[$filter('date')(new Date().setDate(new Date().getDate()+3), 'yyyy-MM-dd')],selected:false,day:$filter('date')(new Date().setDate(new Date().getDate()+3), 'EEE')},
                    {name:$filter('date')(new Date().setDate(new Date().getDate()+4), 'dd'),date:$filter('date')(new Date().setDate(new Date().getDate()+4), 'dd MMM'),id:5,hours:$scope.appointment[$filter('date')(new Date().setDate(new Date().getDate()+4), 'yyyy-MM-dd')],selected:false,day:$filter('date')(new Date().setDate(new Date().getDate()+4), 'EEE')}
                ];

    console.log($scope.days);
    $scope.currentSelected=$scope.days[0];
    $scope.currentHours=$scope.currentSelected['hours'][0];
    console.log($scope.currentSelected);
    for(var i=0;i<$scope.days.length;i++){
        for(var k=0;k<$scope.days[i]['hours'].length;k++){
            if(parseInt($scope.days[i]['hours'][k]['total_apointment'])>=parseInt($scope.days[i]['hours'][k]['no_of_users'])){
                $scope.days[i]['hours'].splice(k,1)
            }
        }
    }

    for(var i=0;i<$scope.days.length;i++){
        for(var k=0;k<$scope.days[i]['hours'].length;k++){
            if(k==0)
            {
                $scope.days[i]['hours'][k]['selected']=true;

            }else{

                $scope.days[i]['hours'][k]['selected']=false;
            }
        }
    }

    $scope.daySelected=function(value){
        for(var i=0;i<$scope.days.length;i++){
            if($scope.days[i]['id']==value['id'])
            {
                $scope.days[i]['selected']=true;
                $scope.currentSelected=$scope.days[i];
                $scope.currentHours=$scope.currentSelected['hours'][0];
            }else{
                $scope.days[i]['selected']=false;
            }
        }
        $scope.timeWidth=120*$scope.currentSelected['hours'].length;
        if($scope.timeWidth<1)
        {
            $scope.timeWidth=220;
        }
    }


    $scope.hoursSelected=function(value){
        for(var i=0;i<$scope.currentSelected['hours'].length;i++){
            if($scope.currentSelected['hours'][i]['row_num']==value['row_num'])
            {
                $scope.currentSelected['hours'][i]['selected']=true;
                $scope.currentHours=$scope.currentSelected['hours'][i];
            }else{
                $scope.currentSelected['hours'][i]['selected']=false;
            }
        }
        console.log( $scope.currentHours);
    }

    $scope.subNetAmount=function()
    {
        return parseFloat($scope.subTotal())-parseFloat($scope.discountAmount());
    }

    $scope.taxAmount=function(){

        return parseFloat($scope.subNetAmount()*$scope.taxPercentage/100);
    }

    $scope.netAmount=function()
    {
        return $scope.subNetAmount()+ parseFloat($scope.taxAmount());
    }

    $scope.no_of_person=function()
    {
        var total = 0;
        angular.forEach($scope.appointmentData.services, function(item) {
            total += parseInt(item.no_of_person);
        })
        return total;
    }


    $scope.confirm=function(){
        if(userService.getData('loginData') && userService.getData('loginData').user_details.user_no)
        {
            if($scope.currentHours && $scope.currentHours['row_num'])
            {
                $scope.appointmentData['confirm']={saloon_id:$scope.appointmentData['saloon']['saloon_details']['saloon_id'],user_id:userService.getData('loginData').user_details.user_no,row_num:$scope.currentHours['row_num'],date:$scope.currentSelected.date,amount:$scope.netAmount(),service_tax:$scope.taxAmount(),facility_id:JSON.stringify($scope.facility_ids),start_time:$scope.currentHours['start_time'],end_time:$scope.currentHours['end_time'],total_discount:$scope.discountAmount(),no_of_person:$scope.no_of_person()};
                //console.log($scope.appointmentData['confirm']);
                userService.setData($scope.appointmentData,'currentSeleted');
                $state.go("confirm",{ id: $scope.appointmentData['saloon']['saloon_details']['saloon_id']});

            }else
            {
                localFactory.toast('you have not select any slot for appointment.');
            }

        }else{
            localFactory.toast('Login to enjoy the benefits of app.');
            $state.go('login');
        }

    }

}])


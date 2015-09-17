app.controller('dealDetailCtrl',['$scope','userService','$state','$stateParams','localFactory','$ionicLoading','$ionicModal','$filter','$ionicHistory',function($scope,userService,$state,$stateParams,localFactory,$ionicLoading,$ionicModal,$filter,$ionicHistory){
    $scope.hideHome=true;
    $scope.dealDetail=userService.getData('deal');
    console.log($scope.dealDetail)
    //$scope.headerName=$scope.dealDetail.facility_name;
    $scope.headerName='Special offer details';
    $scope.dealType=$stateParams.type;
    $scope.shopNow=function(){
        var data={services:[$scope.dealDetail],is_deal:true};
        userService.setData(data,'currentSeleted');
        $state.go("appointment", { id: $scope.dealDetail.saloon_id });
    }


    var disabledDates = [
    ];

    var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    $scope.datepickerObject = {};
    $scope.datepickerObject.deal_start_time = new Date($scope.dealDetail.deal_start_time);
    $scope.datepickerObject.deal_end_time=new Date($scope.dealDetail.deal_end_time);
    $scope.datepickerObject.price=$scope.dealDetail.price;
    $scope.datepickerObject.percent_discount=$scope.dealDetail.percent_discount;
    $scope.datepickerObject.deal_price=function(){
        return $scope.datepickerObject.price-$scope.datepickerObject.price*$scope.datepickerObject.percent_discount/100
    };
    console.log($scope.datepickerObject);
    $scope.datepickerObjectModal = {
        titleLabel: 'Choose Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        errorMsgLabel : 'Please select time.', //Optional
        setButtonType : 'button-assertive', //Optional
        modalHeaderColor:'bar-assertive', //Optional
        modalFooterColor:'bar-assertive', //Optional
        templateType:'modal', //Optional
        inputDate: $scope.datepickerObject.deal_start_time, //Optional
        mondayFirst: true, //Optional
        disabledDates:disabledDates, //Optional
        monthList:monthList, //Optional
        from: new Date(), //Optional
        callback: function (val) { //Optional
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                $scope.datepickerObjectModal.inputDate=val;
                $scope.datepickerObject.deal_start_time = val;
                console.log('Selected date is : ', val)
            }
        }
    };

    $scope.datepickerFromModal = {
        titleLabel: 'Choose Date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        errorMsgLabel : 'Please select time.', //Optional
        setButtonType : 'button-assertive', //Optional
        modalHeaderColor:'bar-assertive', //Optional
        modalFooterColor:'bar-assertive', //Optional
        templateType:'modal', //Optional
        inputDate: $scope.datepickerObject.deal_end_time, //Optional
        mondayFirst: true, //Optional
        disabledDates:disabledDates, //Optional
        monthList:monthList, //Optional
        from: new Date(), //Optional
        callback: function (val) { //Optional
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                $scope.datepickerFromModal.inputDate=val;
                $scope.datepickerObject.deal_end_time = val;
                console.log('Selected date is : ', val)
            }
        }
    };



    $ionicModal.fromTemplateUrl('templates/updateModal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });

    $scope.openModal = function() {
        console.log('Opening Modal');
        $scope.modal.show();
    };

    $scope.updateOffer=function(){
        $scope.modal.show();
    }



    $scope.updateCall=function(){
        var postData={price:$scope.datepickerObject.price,percent_discount:$scope.datepickerObject.percent_discount,saloon_id:$scope.dealDetail.saloon_id,category_id:$scope.dealDetail.category_id,facility_id:$scope.dealDetail.facility_id,deal_price:$scope.datepickerObject.deal_price(),deal_end_time:$filter('date')($scope.datepickerObject.deal_end_time,'yyyy-MM-dd'),deal_start_time:$filter('date')($scope.datepickerObject.deal_start_time,'yyyy-MM-dd')};
        console.log(postData);
        $ionicLoading.show();
        var updatePrice = localFactory.post('saloon_price_edit', postData);
        updatePrice.success(function (data) {
            if(data.result){
                localFactory.toast("Price Update successfully.")
            }else{
                localFactory.toast(data.msg);
            }
            $ionicLoading.hide();
            $scope.modal.hide();
            $ionicHistory.goBack();
        });

        updatePrice.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }

}])

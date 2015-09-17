app.controller('saloonDetails',['$scope','$compile','$stateParams','$ionicScrollDelegate','userService','$ionicModal','saloon','$state','localFactory','$ionicLoading','$timeout','$rootScope',function($scope,$compile,$stateParams,$ionicScrollDelegate,userService,$ionicModal,saloon,$state,localFactory,$ionicLoading,$timeout,$rootScope){
    $scope.showMap=false;
    $scope.scrollPos=0;
    $scope.saloonDetails=saloon;

    $scope.showMap=false;
    $timeout(function(){
        return false; // <--- comment this to "fix" the problem
        var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

        var container = sv.__container;

        var originaltouchStart = sv.touchStart;
        var originalmouseDown = sv.mouseDown;
        var originaltouchMove = sv.touchMove;
        var originalmouseMove = sv.mouseMove;

        container.removeEventListener('touchstart', sv.touchStart);
        container.removeEventListener('mousedown', sv.mouseDown);
        document.removeEventListener('touchmove', sv.touchMove);
        document.removeEventListener('mousemove', sv.mousemove);


        sv.touchStart = function(e) {
            e.preventDefault = function(){}
            originaltouchStart.apply(sv, [e]);
        }

        sv.touchMove = function(e) {
            e.preventDefault = function(){}
            originaltouchMove.apply(sv, [e]);
        }

        sv.mouseDown = function(e) {
            e.preventDefault = function(){}
            originalmouseDown.apply(sv, [e]);
        }

        sv.mouseMove = function(e) {
            e.preventDefault = function(){}
            originalmouseMove.apply(sv, [e]);
        }

        container.addEventListener("touchstart", sv.touchStart, false);
        container.addEventListener("mousedown", sv.mouseDown, false);
        document.addEventListener("touchmove", sv.touchMove, false);
        document.addEventListener("mousemove", sv.mouseMove, false);
    });

    $scope.toggleMap=function(){
        if(!$scope.showMap){
            $scope.showMap=true;
            $scope.map = {center: {latitude:$scope.saloonDetails.saloon_details.latitude, longitude: $scope.saloonDetails.saloon_details.longitude }, zoom: 11};
            $scope.options = {scrollwheel: false,draggable: false,zoom:7, disableDefaultUI: true};
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: $scope.saloonDetails.saloon_details.latitude,
                    longitude:$scope.saloonDetails.saloon_details.longitude
                }
            };
        }
        $ionicScrollDelegate.scrollTo(0, 440, true);
    }

    console.log(saloon);
    $scope.callNumber=function(value){
        window.open('tel:'+value, '_system')
    }

    $scope.webSite=function(value){
        window.open(value, '_blank', 'location=no');
    }
    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab,$event) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
            $ionicScrollDelegate.resize();
        } else {
            //if it's not, add it!
            $scope.activeTabs.push(tab);
            //$($event.target).parent().find('.child-items').find('.row').length
            var scrollTo=45+$ionicScrollDelegate.getScrollPosition().top;
            $ionicScrollDelegate.scrollTo(0, scrollTo, true);
            $ionicScrollDelegate.resize();
        }

    }

    $scope.toggleFev=function(isFev,id){

        if(userService.getData('loginData')){

            if(parseInt(isFev)==1)
            {
                $scope.saloonDetails.saloon_details.is_fev=0;

            }else{

                $scope.saloonDetails.saloon_details.is_fev=1;
            }
            $ionicLoading.show();
            var obj={saloon_id:$stateParams.id,user_id:userService.getData('loginData').user_details.user_no,is_fev:$scope.saloonDetails.saloon_details.is_fev};
            var settingData = localFactory.post('set_fev_saloon', obj);
            settingData.success(function (data) {

                for(var i=0;i<$rootScope.saloonList['saloon_details'].length;i++){
                    if($rootScope.saloonList['saloon_details'][i]['saloon_id']==$stateParams.id)
                    {
                        $rootScope.saloonList['saloon_details'][i]['is_fev']=$scope.saloonDetails.saloon_details.is_fev;
                    }
                }

                $ionicLoading.hide();
            });

            settingData.error(function (data, status, headers, config) {
                $ionicLoading.hide();
            });
        }else{
            localFactory.toast('Login to enjoy the benefits of app.');
            $state.go('login');
        }
    }

    $scope.rating =$scope.saloonDetails.saloon_details.user_rating;
    $scope.rateFunction = function (rate) {
        if(userService.getData('loginData')){
            var obj={saloon_id:$stateParams.id,user_no:userService.getData('loginData').user_details.user_no,rating:rate}
            var settingData = localFactory.post('set_rating', obj);
            settingData.success(function (data) {
                $ionicLoading.hide();
                $scope.rating = rate;
            });

            settingData.error(function (data, status, headers, config) {
                $ionicLoading.hide();
            });

        }else{
            $state.go('login');
        }
    };

    $scope.optaCity={opacity: 0.3};
    $scope.isScrolling=function(){
        $scope.scrollPos=$ionicScrollDelegate.getScrollPosition().top;
        if($scope.scrollPos>0){
            $scope.optaCity={opacity: 0.3};
        }

        if($scope.scrollPos>5){
            $scope.optaCity={opacity: 0.4};
        }

        if($scope.scrollPos>10){
            $scope.optaCity={opacity: 0.5};
        }

        if($scope.scrollPos>15){
            $scope.optaCity={opacity: 0.6};
        }

        if($scope.scrollPos>20){
            $scope.optaCity={opacity: 0.7};
        }

        if($scope.scrollPos>25){
            $scope.optaCity={opacity: 0.8};
        }

        if($scope.scrollPos>30){
            $scope.optaCity={opacity: 0.9};
        }

        if($scope.scrollPos>35){
            $scope.optaCity={opacity: 1};
        }
        $scope.$apply();
    }
    $scope.uploadImages=$scope.saloonDetails.upload_images;
    console.log($scope.uploadImages);
    $scope.allImages =[];
    $scope.allImages.push({upload_url:$scope.saloonDetails.saloon_details.saloon_image});
    if($scope.uploadImages.length>0)
    {
       $scope.allImages=$.merge($scope.allImages,$scope.uploadImages);
    }
    console.log($scope.allImages);
    $scope.showImages = function(index) {
        $scope.showModal('templates/imgSlider.html');
    }

    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    // Close the modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };


    if($scope.saloonDetails.stylist.length>1){

        $scope.contanerValue=(170*$scope.saloonDetails.stylist.length)+"px";

    }else if($scope.saloonDetails.stylist.length==1){

        $scope.contanerValue='100%';
    }

    $scope.saloonServices=$scope.saloonDetails.service;
    for(var i=0;i< $scope.saloonServices.length;i++){

        for(var k=0;k<$scope.saloonServices[i]['items'].length;k++){

            $scope.saloonServices[i]['items'][k]['selected']=false;
        }
    }

    $scope.addItem=function(value){
        if(value.selected==true){

            value.selected=false;
        }else
        {
            value.selected=true;
        }
    }
    console.log($scope.saloonServices);

    $scope.appointment=function(){
        var data={services:[]};
        for(var i=0;i< $scope.saloonServices.length;i++){

            for(var k=0;k<$scope.saloonServices[i]['items'].length;k++){
                if($scope.saloonServices[i]['items'][k]['selected']==true){
                    data.services.push($scope.saloonServices[i]['items'][k]);
                }
            }
        }

        if(data.services.length>0)
        {
            userService.setData(data,'currentSeleted');
            $state.go("appointment", { id: $scope.saloonDetails.saloon_details.saloon_id });

        }else{

            localFactory.alert("You have not select any item.");
        }
    }

    $scope.openOffer=function(){
        $state.go("tab.todaysdeals", {id:$scope.saloonDetails.saloon_details.saloon_id });
    }

    $scope.goToservice=function(){
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    }
}])

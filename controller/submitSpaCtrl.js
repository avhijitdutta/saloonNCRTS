app.controller('submitSpaCtrl',['$scope','userService','localFactory','$cordovaFileTransfer','webservice','$cordovaCamera','$ionicActionSheet','$timeout','$ionicLoading',function($scope,userService,localFactory,$cordovaFileTransfer,webservice,$cordovaCamera,$ionicActionSheet,$timeout,$ionicLoading){
    $scope.headerName="Submit a Saloon or Spa";

    $scope.imageURI="";

    $scope.cityList=userService.getData('settingData').cities;
    $scope.localities=userService.getData('settingData').localities;
    console.log($scope.cityList);
    /* add a extra value*/
    $scope.localities['0']=[
        {locality:"Select your location",id:"0",city_id:0}
    ];
    /*Push a extra value of citylist */
    $scope.cityList.push({city_name:"Select your city",id:"0"});
    $scope.cityList.moveArrayPos($scope.cityList.length-1,0);

    $scope.user={

    };
    $scope.user.city=$scope.cityList[0];
    $scope.locality=$scope.localities[$scope.user.city['id']];
    $scope.user.locality=$scope.locality[0];
    $scope.changeCity = function (value) {
        $scope.locality=$scope.localities[value['id']];
        $scope.user.locality=$scope.locality[0];
    }

    $scope.uploadImage = function () {

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text:'Camera'},
                { text:'Gallery'}
            ],
            titleText: 'Choose your picture',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                openDeviceCamera(index);
            }
        });

        function openDeviceCamera(index){

            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                quality: 99
            };
            if(index==0){
                options['sourceType']=Camera.PictureSourceType.CAMERA;
            }else{
                options['sourceType']=Camera.PictureSourceType.PHOTOLIBRARY;
            }
            $cordovaCamera.getPicture(options).then(function (imageURI) {
                console.log(imageURI);
                $scope.imageURI = imageURI;
                hideSheet();
            }, function (err) {
                console.log(err);
            });
        }
    }

    $scope.saveUser=function(accountForm){
        console.log(accountForm);
        var errorMsg="";
        if(accountForm.saloon_name.$invalid)
        {
            errorMsg+="Saloon name is required.";
        }

        if(accountForm.address.$invalid)
        {
            errorMsg+="\n"+"Address can\'t be empty.";
        }

        if($scope.user.city.id==0)
        {
            errorMsg+="\n"+"Select a city.";
        }

        if($scope.user.locality.id==0)
        {
            errorMsg+="\n"+"Select a locality.";
        }

        if($scope.imageURI=="")
        {
            errorMsg+="\n"+"Please add a Saloon or SPA image.";
        }

        if(errorMsg.length>0)
        {
            localFactory.alert(errorMsg,function()
            {

            },"Alert","OK");
            return;
        }


        if($scope.imageURI!=""){
            $ionicLoading.show();
            var serverURL = webservice.getServiceBase()+'saloon_submit';
            var options = new FileUploadOptions();
            options.fileKey = "saloon_img";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            options.params = $scope.user;
            options.params.city_id= $scope.user.city.id;
            options.params.locality_id=$scope.user.locality.id;
            console.log($scope.user);
            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    localFactory.unload();
                    console.log(result);
                    $scope.user={};
                    $scope.imageURI="";
                    $scope.user.city=$scope.cityList[0];
                    $scope.locality=$scope.localities[$scope.user.city['id']];
                    $scope.user.locality=$scope.locality[0];
                    localFactory.toast('Thank you for submitting .');
                    $ionicLoading.hide();
                }, function (err) {

                    console.log("error");
                    console.log(err);
                    $ionicLoading.hide();

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });

        }else{
            $scope.user['city_id']=$scope.user.city.id;
            $scope.user['locality_id']=$scope.user.locality.id;
            var account = localFactory.post('saloon_submit ',$scope.user);
            account.success(function (data) {
                if(data['result'])
                {
                    localFactory.toast('Thank you for submitting .');
                }else{
                    localFactory.alert(data['msg'],function()
                    {

                    },"Alert","OK");
                }

                localFactory.unload();
            });

            account.error(function (data, status, headers, config) {
                localFactory.unload();
                localFactory.alert("Please check your internet connection",function()
                {

                },"Alert","Ok");

            });
        }

    }

}])

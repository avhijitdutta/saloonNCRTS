app.controller('myaccountCtrl',['$scope','userService','localFactory','$cordovaFileTransfer','webservice','$cordovaCamera','$ionicActionSheet','$timeout','myAccount','$ionicLoading','$rootScope',function($scope,userService,localFactory,$cordovaFileTransfer,webservice,$cordovaCamera,$ionicActionSheet,$timeout,myAccount,$ionicLoading,$rootScope){
    $scope.headerName="My Account";
    $scope.userAccount=myAccount;
    $scope.is_server=false;
    console.log($scope.userAccount);
    $scope.imageURI=myAccount.user_data.img_url;
    if(myAccount.user_data.img_url!="")
    {
        $scope.is_server=true;
    }
    $scope.cityList=userService.getData('settingData').cities;
    $scope.localities=userService.getData('settingData').localities;

    /* add a extra value*/
    $scope.localities['0']=[
        {locality:"Select your location",id:"0",city_id:0}
    ];
    /*Push a extra value of citylist */
    $scope.cityList.push({city_name:"Select your city",id:"0"});
    $scope.cityList.moveArrayPos($scope.cityList.length-1,0);

    $scope.user={
        user_name:$scope.userAccount.user_data.user_name,
        email:$scope.userAccount.user_data.email,
        phone_number:$scope.userAccount.user_data.phone_number,
        city:
        {
            city_name: $scope.userAccount.user_data.city_name,
            id: $scope.userAccount.user_data.city_id
        },
        locality:{
            city_id: $scope.userAccount.user_data.city_id,
            id:  $scope.userAccount.user_data.locality_id,
            locality: $scope.userAccount.user_data.locality
        },
        user_no:userService.getData('loginData').user_details.user_no
    };

    $scope.locality=$scope.localities[$scope.user.city['id']];

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
                 targetWidth: 300,
                 targetHeight: 300,
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
                 $scope.is_server=false;
                 hideSheet();
             }, function (err) {
                 console.log(err);
             });
         }
    }

    $scope.saveUser=function(accountForm){

        var errorMsg="";
        if(accountForm.user_name.$invalid)
        {
            errorMsg+="Full name is required";
        }

        if(accountForm.email.$invalid)
        {
            errorMsg+="\n"+"Enter valid email id";
        }

        if(accountForm.phone_number.$invalid)
        {
            errorMsg+="\n"+"Enter valid Phone no.";
        }

        if($scope.user.city.id==0)
        {
            errorMsg+="\n"+"Select a city.";
        }

        if($scope.user.locality.id==0)
        {
            errorMsg+="\n"+"Select a locality.";
        }

        if(accountForm.current_password && accountForm.current_password.$modelValue && accountForm.current_password.$modelValue!="")
        {
            if(!accountForm.new_password.$modelValue)
            {
                errorMsg+="\n"+"New password can't be empty.";
            }

            if(accountForm.new_password.$modelValue == accountForm.current_password.$modelValue)
            {
                errorMsg+="\n"+"New passsword and current password can't be same";
            }
        }


        if(accountForm.confirm_password.$invalid)
        {
            errorMsg+="\n"+"Confirm password can't be empty.";
        }
        else
        {
            if(accountForm.new_password.$modelValue!=accountForm.confirm_password.$modelValue)
            {
                errorMsg+="\n"+"New passsword and confirm password should be same.";
            }
        }

        if(errorMsg.length>0)
        {
            localFactory.alert(errorMsg,function()
            {

            },"Alert","OK");
            return;
        }

/*      var postData=$scope.user;
        postData['city']=postData['city']['id'];
        postData['locality']=postData['locality']['id'];*/

        $ionicLoading.show();
        if($scope.imageURI && $scope.imageURI!="" && !$scope.is_server){
            var serverURL = webservice.getServiceBase()+'account_details';
            var options = new FileUploadOptions();
            options.fileKey = "img_url";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            options.params = $scope.user;
            options.params.city_id= $scope.user.city.id;
            options.params.locality_id=$scope.user.locality.id;
            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    $ionicLoading.hide();
                    console.log(result);
                    var data = JSON.parse(result.response);
                    console.log(data.user_data.img_url);
                    var tempLogin=userService.getData('loginData');
                    console.log(tempLogin);
                    tempLogin['user_details']['img_url']=data.user_data.img_url;
                    userService.setData(tempLogin,'loginData');
                    console.log(userService.getData('loginData'));
                    $rootScope.userProfilePic=data.user_data.img_url;
                    localFactory.toast(data.msg);
                }, function (err) {
                    $ionicLoading.hide();
                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });
        }else{
            $scope.user['city_id']=$scope.user.city.id;
            $scope.user['locality_id']=$scope.user.locality.id;
            var account = localFactory.post('account_details ',$scope.user);
            account.success(function (data) {
                if(data['result'])
                {
                    localFactory.toast('Account update successfully');
                }else{
                    localFactory.alert(data['msg'],function()
                    {

                    },"Alert","OK");
                }

                $ionicLoading.hide();
            });

            account.error(function (data, status, headers, config) {
                $ionicLoading.hide();
                localFactory.alert("Please check your internet connection",function()
                {

                },"Alert","Ok");

            });
        }
    }

    $scope.totalPoint=0;

    for(var i=0;i<$scope.userAccount.user_points.length;i++){
        $scope.totalPoint=$scope.totalPoint+$scope.userAccount.user_points['point']
    }

}])


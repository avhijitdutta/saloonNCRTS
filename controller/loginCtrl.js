app.controller('loginCtrl',['$scope','localFactory','$state','userService','$ionicLoading','$ionicHistory','$rootScope',function($scope,localFactory,$state,userService,$ionicLoading,$ionicHistory,$rootScope){
     $scope.user={};
     $scope.user.email = (localFactory.getLocalItem("email") =="" || localFactory.getLocalItem("email") ==null ) ? "" : localFactory.getLocalItem("email");
     $scope.user.password = (localFactory.getLocalItem("password") =="" || localFactory.getLocalItem("password") ==null ) ? "" : localFactory.getLocalItem("password");
     $scope.user.remember=true;
    if(localFactory.getLocalItem("password") != undefined ||  localFactory.getLocalItem("password") != "" || localFactory.getLocalItem("password") != null){

        $scope.checked = true;

    }else
    {
        $scope.checked = false;
    }

    $scope.forgotPass = function() {
        localFactory.prompt("Please enter your register email ",function(value)
        {
            if(validateEmail(value) && value!="example@example.com")
            {
                localFactory.load();
                var postData={email:value};
                var saloonList = localFactory.post('forget_password', postData);
                saloonList.success(function (data) {
                    localFactory.unload();
                    localFactory.alert(data.msg);

                });

                saloonList.error(function (data, status, headers, config) {

                });
            }else{
                localFactory.alert("Invalid email id");
            }
        },"example@example.com","Confirm");
    };

    $scope.submitForm = function(userForm) {
        console.log(userForm.email);
        if(!$scope.user.email){
            localFactory.alert("Please enter email id or phone no.");
            return false;
        }

        if(!$scope.user.password){
            localFactory.alert("please enter password.");
            return false;
        }

        if($scope.user.remember ==true ){

            localFactory.setLocalItem("email", $scope.user.email,false);
            localFactory.setLocalItem("password", $scope.user.password,false);

        }else{

            localFactory.setLocalItem("email", "");
            localFactory.setLocalItem("password", "");
        }

        $scope.loginFb($scope.user);
    }

    $scope.loginFaceBook=function()
    {
        facebook.getLoginStatus(function(successData)
        {
            if(successData.status=="connected")
            {
                //alert(successData.status);
                facebook.fbGetUserDetail(successData.authResponse.userID,function(obj)
                {
                    localFactory.unload();
                    console.log(obj);
                    var credential = {
                        email: obj.email,
                        fid:obj.id,
                        user_name:obj.name
                    };
                    $scope.loginFb(credential);
                });

            }else
            {
                facebook.login(function(sucess)
                {
                    /*console.log(sucess.authResponse.userID);*/
                    facebook.fbGetUserDetail(sucess.authResponse.userID,function(obj)
                    {
                        localFactory.unload();
                        console.log(obj);
                        var credential = {
                            email: obj.email,
                            fid:obj.id,
                            user_name:obj.name
                        };
                        $scope.loginFb(credential);
                    },function(){
                        localFactory.unload();
                    });
                });
            }

        },function(error){
            localFactory.unload();
            localFactory.alert("Please check your internet connection .",function()
            {

            },"Alert","OK");
        })
    }

    $scope.loginFb=function(credential)
    {
        //localFactory.load();
        $ionicLoading.show();

        var requestLogin = localFactory.post('login', credential);
        requestLogin.success(function (data) {
            if(data.result)
            {
                $rootScope.userProfilePic=data.user_details.img_url;
                data['social_login']=0;
                userService.setData(data,'loginData');
                if(data.user_details.user_type==2){
                    $rootScope.loginType=1;
                    $state.go('saloonSide.home');
                }else if(data.user_details.user_type==4){
                    $rootScope.showFilter=true;
                    $rootScope.loginType=0;
                    if($rootScope.previousState=='promotion' || $rootScope.previousState=='registration')
                    {
                        $state.go('tab.todaysdeals');

                    }else{
                        $ionicHistory.goBack();
                    }
                }
            }else
            {
                localFactory.alert(data.msg,function()
                {

                },"Alert","OK");
            }
            $ionicLoading.hide();
        });

        requestLogin.error(function (data, status, headers, config) {
            //localFactory.unload();
            $ionicLoading.hide();
            localFactory.alert("Please check your internet connection",function()
            {

            },"Alert","Ok");

        });
    }
}])

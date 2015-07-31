app.controller('loginCtrl',['$scope','localFactory','$state','userService','$ionicLoading',function($scope,localFactory,$state,userService,$ionicLoading){
     $scope.user={};
     $scope.user.email = (localFactory.getLocalItem("email") =="" || localFactory.getLocalItem("email") ==null ) ? "" : localFactory.getLocalItem("email");
     $scope.user.password = (localFactory.getLocalItem("password") =="" || localFactory.getLocalItem("password") ==null ) ? "" : localFactory.getLocalItem("password");

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

    $scope.loginApp = function() {

        if($scope.user.email == '' || $scope.user.password == '' || $scope.user.email == null || $scope.user.password == null){
            localFactory.alert("Please enter username & password");
            return false;
        }


        if($scope.checked ==true ){

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
        $ionicLoading.show({
            template: 'Loading...'
        });

        var requestLogin = localFactory.post('login', credential);
        requestLogin.success(function (data) {

            if(data.result)
            {
                userService.setData(data);
                $state.go('tab.home');
            }else
            {
                localFactory.alert(data.msg,function()
                {

                },"Alert","OK");
                //localFactory.unload();
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

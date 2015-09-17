app.controller('promotionCtrl', [ '$scope','$rootScope','$cordovaFacebook','$ionicLoading','localFactory','$state','userService', function($scope,$rootScope,$cordovaFacebook,$ionicLoading,localFactory,$state,userService) {
    $scope.slideHasChanged=function(){

    }

    $scope.loginFaceBook=function()
    {
        $cordovaFacebook.getLoginStatus()
            .then(function (success) {
                console.log(success);

                if (success.status === 'connected') {

                    $cordovaFacebook.logout()
                        .then(function (success) {
                           console.log(success);
                        }, function (error) {
                            console.log(error);
                    });

                } else {

                    $cordovaFacebook.login(["email","public_profile","user_friends"])
                        .then(function (success) {
                            console.log(success);
                            $cordovaFacebook.api("me?fields=id,name,picture,email", ["public_profile",'email'])
                                .then(function (result) {
                                    console.log(result);
                                    var credential = {
                                        email: result.email,
                                        fid: result.id,
                                        user_name: result.name,
                                        fb_url: result.picture.data.url
                                    };
                                    $scope.loginFb(credential);
                                }, function (error) {
                                    console.log(error);
                                });

                        }, function (error) {
                            // error
                        });
                }
            }, function (error) {
                console.log(error);
            });
    }

    $scope.loginFb=function(credential)
    {
        $ionicLoading.show();

        var requestLogin = localFactory.post('login', credential);
        requestLogin.success(function (data) {
            if(data.result)
            {
                $rootScope.userProfilePic=data.user_details.img_url;
                data['social_login']=1;
                userService.setData(data,'loginData');
                $rootScope.showFilter=true;
                $rootScope.loginType=0;
                $state.go('tab.todaysdeals');
            }else
            {
                localFactory.alert(data.msg,function()
                {

                },"Alert","OK");
            }
            $ionicLoading.hide();
        });

        requestLogin.error(function (data, status, headers, config) {
            $ionicLoading.hide();
            localFactory.alert("Please check your internet connection",function()
            {

            },"Alert","Ok");

        });
    }
    $rootScope.map=false;
}])
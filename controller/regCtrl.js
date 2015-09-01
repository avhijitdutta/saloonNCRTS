app.controller('regCtrl',['$scope','localFactory','settingData','$ionicLoading','$state',function($scope,localFactory,settingData,$ionicLoading,$state){

    $scope.cityList=settingData.cities;
    /* add a extra value*/
    settingData.localities['0']=[
        {locality:"Select your location",id:"0",city_id:0}
    ];

    /*Push a extra value of citylist */
    $scope.cityList.push({city_name:"Select your city",id:"0"});
    $scope.cityList.moveArrayPos($scope.cityList.length-1,0);

    $scope.user={};
    $scope.user.city=$scope.cityList[0];
    if($scope.user.city['id']>0)
    {
        $scope.locality=settingData.localities[$scope.user.city['id']];
    }else{
        $scope.locality=settingData.localities[0];
    }

    $scope.user.locality=$scope.locality[0];

    $scope.changeCity = function (value) {
        $scope.locality=settingData.localities[value['id']];
        $scope.user.locality=$scope.locality[0];
    }

    // function to submit the form after all validation has occurred
    $scope.submitForm = function(userForm) {
        //console.log(userForm);
        var errorMsg="";
        if(userForm.user_name.$invalid)
        {
            errorMsg+="User name is required."+"\n";
        }

        if(userForm.email.$invalid)
        {
            errorMsg+="Enter valid email id."+"\n";
        }

        if(userForm.password.$invalid)
        {
            errorMsg+="Password is required."+"\n";
        }

        if(userForm.repassword.$invalid)
        {
            errorMsg+="Retype your password."+"\n";
        }

        if(userForm.phone_number.$invalid)
        {
            errorMsg+="Phone number is required."+"\n";
        }

        if($scope.user.password!= $scope.user.repassword)
        {
            errorMsg+="Your password do not match."+"\n";
        }

        if($scope.user.city.id==0)
        {
            errorMsg+="Select a city."+"\n";
        }

        if($scope.user.locality.id==0)
        {
            errorMsg+="Select a locality.";
        }

        // check to make sure the form is completely valid
        if (userForm.$valid) {

            $ionicLoading.show();
            var signup = localFactory.post('signup',$scope.user);
            signup.success(function (data) {
                $ionicLoading.hide();
                localFactory.toast(data.msg);
                if(data.result)
                {
                    $state.go('login')
                }
            });

            signup.error(function (data, status, headers, config) {
                $ionicLoading.hide();
                localFactory.alert("Please check your internet connection",function()
                {

                },"Alert","OK");

            });

        }else
        {
            localFactory.alert(errorMsg,function(obj)
            {

            },"Missing Info","OK");
        }

    };
}])

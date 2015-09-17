// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=false&callback=initialize';
    document.body.appendChild(script);
}
var defaultPath = "";
var loginBackCount=0;
var homepath="";
var app=angular.module('beautySaloon', ['ionic','ui.router','truncate','commonFactory','ngCordova','appCommon','uiGmapgoogle-maps','ionic-datepicker'])
.run(function($ionicPlatform,localFactory,$ionicHistory,$document,$rootScope,$ionicLoading,$location,userService,$state,$ionicPopup,$cordovaSplashscreen,$cordovaFacebook,$ionicSideMenuDelegate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      setTimeout(function() {
          $cordovaSplashscreen.hide();
      }, 5000)

      var push = PushNotification.init({
          "android": {
              "senderID": "487326281555"
          },
          "ios": {"alert": "true", "badge": "true", "sound": "true"},
          "windows": {}
      });

      push.on('registration', function(data) {
          console.log("registration event");
          alert(data.registrationId);
          console.log(JSON.stringify(data));
      });

      push.on('notification', function(data) {
          console.log("notification event");
          console.log(JSON.stringify(data));
      });

      push.on('error', function(e) {
          console.log("push error");
      });

      if(window.Connection) {
          if(navigator.connection.type == Connection.NONE) {
              $ionicPopup.confirm({
                  title: "No Internet connection",
                  content: "The internet is disconnected on your device."
              })
              .then(function(result) {

                  if(!result) {
                      ionic.Platform.exitApp();
                  }
              });
          }
      }

        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }

      $rootScope.logout=function(){
        $ionicLoading.show();

        var logout = localFactory.post('logout', {});
        logout.success(function (data) {
            $ionicLoading.hide();
            if (window.localStorage.getItem('SingerloginData') && window.localStorage.getItem('SingerloginData')!='null') {
                var data=$.parseJSON(window.localStorage.getItem('SingerloginData'))['social_login'];
                if(data){
                    $cordovaFacebook.logout()
                        .then(function (success) {
                            console.log(success);
                        }, function (error) {
                            console.log(error);
                        });
                }
            }
            userService.resetData('loginData');
            $state.go('promotion');
            $rootScope.showFilter=false;
        });

        logout.error(function (data, status, headers, config) {
            $ionicLoading.hide();
        });
    }

      $rootScope.shareApp=function(){

      }
      $rootScope.toggleMenuleft = function(value) {
          if(value && value=='logout'){

              $rootScope.logout();
          }
          $ionicSideMenuDelegate.toggleLeft();
      };

      $rootScope.showFiler = function() {
          $ionicSideMenuDelegate.toggleRight();
      }

        document.removeEventListener("backbutton", function(){}, false);
        $rootScope.userAppointment=0;// user appointment count
        $rootScope.showFilter=true; // show side bar option
        $rootScope.loginType=0;    // login type depend on the which type of user login
      $rootScope.userProfilePic="";
      if (window.localStorage.getItem('SingerloginData') && window.localStorage.getItem('SingerloginData')!='null') {
          var data=$.parseJSON(window.localStorage.getItem('SingerloginData'));
          if(data['saloon_details']['saloon_id']){
              $rootScope.loginType=1;
          }else{
              $rootScope.loginType=0;
          }

          $rootScope.userProfilePic=data['user_details']['img_url'];
      }
    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.search=false;
    $rootScope.page_number="";



    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
          $rootScope.previousState = from.name;
          $rootScope.currentState = to.name;
          console.log('Previous state:'+$rootScope.previousState)
          console.log('Current state:'+$rootScope.currentState)
    });

  });

  $ionicPlatform.onHardwareBackButton(function () {
        if ($location.path() === "/tab/todaysdeals/" || $location.path() === "/promotion" || $location.path()==="/saloon/saloonhome") {

            if (loginBackCount > 0) {
                navigator.app.exitApp();
            }

            if (loginBackCount < 1) {
                loginBackCount++;
                setTimeout(function () {
                    loginBackCount = 0;
                }, 2000);
                var tostText = "Press back button again to quit";
                localFactory.toast(tostText, 'short', 'bottom');
            }

        }else {

            $ionicHistory.goBack();
        }
    })


})

.config(['$stateProvider', '$urlRouterProvider','uiGmapGoogleMapApiProvider', function($stateProvider, $urlRouterProvider,uiGmapGoogleMapApiProvider) {

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDnvDa3XWYgZ6Y8Vg-dwX88jh3rhnT2Xpg',
            v: '3.17',
            libraries: 'weather,geometry,visualization,places'
        });

        if (window.localStorage.getItem('SingerloginData') && window.localStorage.getItem('SingerloginData')!='null') {
            var data=$.parseJSON(window.localStorage.getItem('SingerloginData'))['saloon_details']['saloon_id'];
            if(data){
                defaultPath ="/saloon/saloonhome";
            }else{
                defaultPath ="/tab/todaysdeals/";
            }
        }else{
            defaultPath ="/promotion";
        }

        $stateProvider
            .state('promotion', {
                url : '/promotion',
                templateUrl : 'view/promotional.html',
                controller : 'promotionCtrl',
                cache: false
            })
            .state('login',{
                url:'/signin',
                templateUrl:'view/login.html',
                controller:'loginCtrl',
                cache: false
            })
            .state('registration',{
                url:'/signup',
                templateUrl:'view/registration.html',
                controller:'regCtrl',
                cache: false,
                resolve:{
                    settingData:function($q,localFactory,$ionicLoading){
                        localFactory.checkInternet();
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('settings', {});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('tab', {
                url : '/tab',
                templateUrl : 'view/sidemenu.html',
                abstract : true,
                controller : 'sideCtrl',
                resolve:{
                    /*settingData:function($q,localFactory,$ionicLoading){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('settings', {});
                        settingData.success(function (data) {

                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {

                            defer.reject(data);
                        });
                        return defer.promise;
                    }*/
                },
                cache: true
            })
            .state('sidelist', {
                url : '/side',
                templateUrl : 'view/side-list.html',
                abstract : true,
                controller : 'sideListCtrl',
                cache:true
            })
            .state('sidelist.saloonList', {
                url: '/saloonList',
                resolve: {
                    saloons:function(localFactory,$q,listPostData,userService,$ionicLoading,$filter,$cordovaGeolocation){
                       /* $ionicLoading.show();

                        var defer = $q.defer();
                        var postData={

                        };

                        if(userService.getData('loginData')!=null){
                            postData['user_id']=userService.getData('loginData').user_details.user_no;
                        }
                        postData['current_time']=$filter('date')(new Date(), 'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(), 'yyyy-MM-dd');

                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function (position) {
                                postData['latitude']=position.coords.latitude;
                                postData['longitude']=position.coords.longitude;
                                postData['saloon_name']="";
                                listPostData.setData(postData);
                                var shopList=listPostData.post();
                                defer.resolve(shopList);
                            }, function (err) {
                                $ionicLoading.hide();
                                localFactory.alert("Please turn on GPS on your mobile.");
                            });
                        return defer.promise;*/
                    }
                },
                views: {
                    'side-list-view': {
                        templateUrl: 'view/saloonList.html',
                        controller: 'saloonList'
                    }
                },
                cache: true
            })
            .state('sidelist.saloonListMap', {
                url: '/saloonListMap',
                views: {
                    'side-list-view': {
                        templateUrl: 'view/mapView.html',
                        controller: 'saloonMapCtrl'
                    }
                },
                resolve: {
                    location:function(localFactory,$q,listPostData,$stateParams,userService,$ionicLoading,$cordovaGeolocation){

                        var defer = $q.defer();
                        var posOptions = {timeout: 10000, enableHighAccuracy: false};
                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function (position) {
                                defer.resolve(position);
                            }, function (err) {
                                localFactory.alert("Please turn on GPS on your mobile.");
                                defer.reject(err)
                            });
                        return defer.promise;
                    }
                },
                cache: true
            })
            .state('detailSaloon',{
                url:'/detailSaloon/:id',
                templateUrl:'view/saloonDetails.html',
                controller:'saloonDetails',
                cache: false,
                resolve: {

                    saloon:function(localFactory,$q,$stateParams,userService,$ionicLoading){
                       
                        $ionicLoading.show();
                        var postData={
                            saloon_id:$stateParams.id
                        };
                        if(userService.getData('loginData') && userService.getData('loginData')!=null){
                            postData['user_id']=userService.getData('loginData').user_details.user_no;
                        }
                        var defer = $q.defer();
                        var settingData = localFactory.post('saloon_details', postData);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('stylest',{
                url:'/stylest/:id',
                templateUrl:'view/stylest.html',
                controller:'stylestCtrl',
                cache: false,
                resolve:{
                    stylest:function($q,localFactory,$ionicLoading,$stateParams,userService){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('stylist_details', {user_no:userService.getData('loginData').user_details.user_no,stylist_no:$stateParams.id});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('appointment',{
                url:'/appointment/:id',
                templateUrl:'view/appointment.html',
                controller:'appointmentCtrl',
                cache: false,
                resolve:{
                    appointment:function($q,localFactory,$ionicLoading,$stateParams,userService,$filter){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var obj={saloon_id:$stateParams.id,current_time:$filter('date')(new Date(), 'HH:mm:ss'),current_date:$filter('date')(new Date(), 'yyyy-MM-dd')};

                        var settingData = localFactory.post('available_slot', obj);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }

            })
            .state('confirm',{
                url:'/confirm/:id',
                templateUrl:'view/confirm.html',
                controller:'confirmCtrl',
                cache: false
            })
            .state('checkin',{
                url:'/checkin',
                templateUrl:'view/checkin.html',
                controller:'checkinCtrl',
                cache: false
            })
            .state('submit',{
                url:'/submit',
                templateUrl:'view/submitspa.html',
                controller:'submitSpaCtrl',
                cache: false
            })
            .state('myaccount',{
                url:'/mycount',
                templateUrl:'view/myaccount.html',
                controller:'myaccountCtrl',
                cache: false,
                resolve:{
                    myAccount:function($q,localFactory,$ionicLoading,userService){
                        $ionicLoading.show();
                        var obj={user_no:userService.getData('loginData').user_details.user_no};
                        var defer = $q.defer();
                        var settingData = localFactory.post('account_details', obj);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('lottery',{
                url:'/lottery',
                templateUrl:'view/lottery.html',
                controller:'lotterytCtrl',
                cache: false,
                resolve:{
                    lottery:function($q,localFactory,$ionicLoading,userService){
                        $ionicLoading.show();

                        var defer = $q.defer();
                        var settingData = localFactory.post('todays_winner', {});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'view/home.html',
                        controller: 'homeCtrl'
                    }
                },
                cache: true
            })
            .state('tab.todaysdeals', {
                url: '/todaysdeals/:id',
                views: {
                    'tab-todays': {
                        templateUrl: 'view/todays.html',
                        controller: 'todaysCtrl'
                    }
                },
                resolve:{
                    /*todaysDeal:function($q,localFactory,$ionicLoading,userService,$filter){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var postData={};
                        postData['current_time']=$filter('date')(new Date(),'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(),'yyyy-MM-dd');
                        if(userService.getData('loginData') && userService.getData('loginData')!=null){
                            postData['user_no']=userService.getData('loginData').user_details.user_no;
                        }
                        var settingData = localFactory.post('todays_deal', postData);
                        settingData.success(function (data) {
                            defer.resolve(data);
                            $ionicLoading.hide();
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }*/
                },
                cache: true
            })
            .state('favDealList',{
                url:'/favDealList',
                templateUrl:'view/fevDealList.html',
                controller:'fevDealListCtrl',
                cache: false,
                resolve: {
                    todaysDeal:function($q,localFactory,$ionicLoading,userService,$filter){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var postData={};
                        postData['current_time']=$filter('date')(new Date(),'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(),'yyyy-MM-dd');
                        if(userService.getData('loginData') && userService.getData('loginData')!=null){
                            postData['user_no']=userService.getData('loginData').user_details.user_no;
                            postData['only_favorite']=1;
                        }
                        var settingData = localFactory.post('todays_deal', postData);
                        settingData.success(function (data) {
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('dealDetail',{
                url:'/dealDetail/:id/:type',
                templateUrl:'view/dealDetail.html',
                controller:'dealDetailCtrl',
                cache: false
            })
            .state('favSaloonList',{
                url:'/favSaloonList',
                templateUrl:'view/saloonFav.html',
                controller:'saloonFavCtrl',
                cache: false,
                resolve: {
                    saloons:function(localFactory,$q,listPostData,$stateParams,userService,$ionicLoading,$cordovaGeolocation,$filter){
                        $ionicLoading.show();

                        var defer = $q.defer();
                        var postData={

                        };

                        if(userService.getData('loginData')!=null){
                            postData['user_id']=userService.getData('loginData').user_details.user_no;
                        }

                        postData['current_time']=$filter('date')(new Date(), 'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(), 'yyyy-MM-dd');

                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function (position) {
                                postData['latitude']=position.coords.latitude;
                                postData['longitude']=position.coords.longitude;
                                listPostData.setData(postData);
                                var shopList=listPostData.post();
                                defer.resolve(shopList);
                            }, function (err) {
                                $ionicLoading.hide();
                                localFactory.alert("Please turn on GPS on your mobile.");
                            });


                        return defer.promise;
                    }
                }
            })
            .state('favStylistList',{
                url:'/favStylistList',
                templateUrl:'view/stylistFav.html',
                controller:'StylistFavCtrl',
                cache: false,
                resolve:{
                    stylistList:function($q,localFactory,$ionicLoading,userService){
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('get_favorite_stylist', {user_no:userService.getData('loginData').user_details.user_no});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('appointmentHistory',{
                url:'/appointmentHistory',
                templateUrl:'view/appointmentHistory.html',
                controller:'appointmentHistory',
                cache: false,
                resolve:{
                    history:function($q,localFactory,$ionicLoading,userService,$filter){
                        $ionicLoading.show();
                        var postData={user_no:userService.getData('loginData').user_details.user_no}
                        postData['current_time']=$filter('date')(new Date(), 'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(), 'yyyy-MM-dd');
                        var defer = $q.defer();
                        var settingData = localFactory.post('appointment_history', postData);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('appointmentDetails',{
                url:'/appointmentDetails/:id',
                templateUrl:'view/appointmentDetails.html',
                controller:'appointmentDetails',
                cache: false,
                resolve: {
                    historyDetail: function ($q, localFactory, $ionicLoading, userService, $stateParams) {
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('appointment_history_details', {appointment_id: $stateParams.id});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('faq',{
                url:'/faq',
                templateUrl:'view/faq.html',
                controller:'faqCtrl',
                cache: false
            })
            .state('about',{
                url:'/about',
                templateUrl:'view/about.html',
                controller:'aboutCtrl',
                cache: false
            })
            .state('noconnection',{
                url:'/noconnection',
                templateUrl:'view/noconnection.html',
                controller:'aboutCtrl',
                cache: false
            })
            .state('saloonSide', {
                url : '/saloon',
                templateUrl : 'view/saloonSide.html',
                abstract : true,
                controller : 'saloonSideCtrl'
            })
            .state('saloonSide.home', {
                url: '/saloonhome',
                views: {
                    'saloon-home': {
                        templateUrl: 'view/saloonAppointments.html',
                        controller: 'saloonHomeCtrl'
                    }
                },
                cache: false,
                resolve: {
                    appointments: function ($q, localFactory, $ionicLoading, $filter,userService) {
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var postData={saloon_id:userService.getData('loginData')['user_details']['saloon_id']};
                        postData['current_time']=$filter('date')(new Date(), 'HH:mm:ss');
                        postData['current_date']=$filter('date')(new Date(), 'yyyy-MM-dd');
                        var settingData = localFactory.post('appointment_history', postData);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('appointmentSaloon',{
                url:'/appointmentSaloon/:id',
                templateUrl:'view/appointmentSaloon.html',
                controller:'appointmentSaloonCtrl',
                cache: false,
                resolve: {
                    historyDetail: function ($q, localFactory, $ionicLoading, userService, $stateParams) {
                        $ionicLoading.show();
                        var defer = $q.defer();
                        var settingData = localFactory.post('appointment_history_details', {appointment_id: $stateParams.id});
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
            .state('salonOffer',{
                url:'/salonOffer',
                templateUrl:'view/salonOffer.html',
                controller:'salonOfferCtrl',
                cache: true
            })
            .state('myservices',{
                url:'/myservices',
                templateUrl:'view/myservices.html',
                controller:'myservices',
                cache: false,
                resolve: {
                    saloon:function(localFactory,$q,$stateParams,userService,$ionicLoading){
                        $ionicLoading.show();

                        var postData={
                            saloon_id:userService.getData('loginData')['user_details']['saloon_id']
                        };

                        var defer = $q.defer();
                        var settingData = localFactory.post('saloon_details', postData);
                        settingData.success(function (data) {
                            $ionicLoading.hide();
                            defer.resolve(data);
                        });

                        settingData.error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            defer.reject(data);
                        });
                        return defer.promise;
                    }
                }
            })
        $urlRouterProvider.otherwise(function ($injector, $location) {
            return defaultPath
        });

    }])

app.controller('headerCtrl',['$scope','$location','$rootScope','$ionicHistory','$state','localFactory','listPostData','$ionicLoading',function($scope,$location,$rootScope,$ionicHistory,$state,localFactory,listPostData,$ionicLoading){
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.goHome = function(){
            if($rootScope.loginType){
                $ionicHistory.goBack();
            }else{
                $state.go('tab.todaysdeals');
            }

        }

        $scope.searchKey="";
        $scope.searchSaloon=function(){
            var obj={saloon_name:$scope.searchKey};
            listPostData.setData(obj);
            document.activeElement.blur();
            $ionicLoading.show();
            var saloonList = localFactory.post('saloon_list',listPostData.getData());
            saloonList.success(function (data) {
                $ionicLoading.hide();
                $rootScope.saloonList.saloon_details=data.saloon_details;
                $rootScope.saloonList.page_number=data.page_number;
                $rootScope.$broadcast('scroll.refreshComplete');
            });

            saloonList.error(function (data, status, headers, config) {
                $ionicLoading.hide();
                localFactory.alert("Check your internet connection.");
            });
        }

    }])
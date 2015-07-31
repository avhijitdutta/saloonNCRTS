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

var app=angular.module('beautySaloon', ['ionic','ui.router','truncate','commonFactory'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
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
                controller : 'sideCtrl'
            })
            .state('sidelist', {
                url : '/side',
                templateUrl : 'view/side-list.html',
                abstract : true,
                controller : 'sideListCtrl'
            })
            .state('sidelist.saloonList', {
                url: '/saloonList/:id',
                resolve: {
                    saloons:function(localFactory,$q,listPostData,$stateParams){
                        var defer = $q.defer();
                        var postData={
                            category_id:$stateParams.id
                        };
                        listPostData.setData(postData);
                        console.log(listPostData.getData());
                        var shopList=listPostData.post();
                        console.log(shopList);
                        defer.resolve(shopList);
                        return defer.promise;
                    }
                },
                views: {
                    'side-list-view': {
                        templateUrl: 'view/saloonList.html',
                        controller: 'saloonList'
                    }
                },
                cache: false
            })
            .state('sidelist.saloonListMap', {
                url: '/saloonListMap/:id',
                views: {
                    'side-list-view': {
                        templateUrl: 'view/mapView.html',
                        controller: 'saloonMapCtrl'
                    }
                },
                cache: false
            })
            .state('detailSaloon',{
                url:'/detailSaloon/:id',
                templateUrl:'view/saloonDetails.html',
                controller:'saloonDetails',
                cache: false
            })
            .state('stylest',{
                url:'/stylest/:id',
                templateUrl:'view/stylest.html',
                controller:'stylestCtrl',
                cache: false
            })
            .state('appointment',{
                url:'/appointment/:id',
                templateUrl:'view/appointment.html',
                controller:'appointmentCtrl',
                cache: false
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
                cache: false
            })
            .state('lottery',{
                url:'/lottery',
                templateUrl:'view/lottery.html',
                controller:'lotterytCtrl',
                cache: false
            })

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'view/home.html',
                        controller: 'homeCtrl'
                    }
                },
                cache: false
            })
            .state('tab.todaysdeals', {
                url: '/todaysdeals',
                views: {
                    'tab-todays': {
                        templateUrl: 'view/todays.html',
                        controller: 'todaysCtrl'
                    }
                },
                cache: false
            })
            .state('dealDetail',{
                url:'/dealDetail/:id',
                templateUrl:'view/dealDetail.html',
                controller:'dealDetailCtrl',
                cache: false
            })
            .state('favSaloonList',{
                url:'/favSaloonList',
                templateUrl:'view/saloonFav.html',
                controller:'saloonFavCtrl',
                cache: false
            })
            .state('favStylistList',{
                url:'/favStylistList',
                templateUrl:'view/stylistFav.html',
                controller:'StylistFavCtrl',
                cache: false
            })
            .state('appointmentHistory',{
                url:'/appointmentHistory',
                templateUrl:'view/appointmentHistory.html',
                controller:'appointmentHistory',
                cache: false
            })
            .state('appointmentDetails',{
                url:'/appointmentDetails/:id',
                templateUrl:'view/appointmentDetails.html',
                controller:'appointmentDetails',
                cache: false
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
            $urlRouterProvider.otherwise('/promotion');
    }])

    app.controller('headerCtrl',['$scope','$location','$rootScope','$ionicHistory','$state',function($scope,$location,$rootScope,$ionicHistory,$state){
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.goHome = function(){
            $state.go('tab.home');
        }
    }])
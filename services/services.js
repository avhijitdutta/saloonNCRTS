app.service('userService', function(localFactory){
    this.login={};
    this.preFix="Singer";
    this.getData = function(key) {
        return $.parseJSON(localFactory.getLocalItem(this.preFix+key));
    }

    this.setData = function (obj,key) {
        localFactory.setLocalItem(this.preFix+key, JSON.stringify(obj));
    }

    this.resetData = function (key) {
        localFactory.setLocalItem(this.preFix+key, null);
    }
});


app.service('listPostData', function(localFactory,$q,userService,$ionicLoading,$filter){
    var self=this;
    this.defaultValue={
        latitude:"",
        longitude:"",
        category_id:1,
        user_id:"",
        sort_by:1,
        filter_by_date:$filter('date')(new Date(), 'yyyy-MM-dd'),
        start_time:{
            label: "08:00 AM",
            value: "08:00"
        },
        end_time:{
            label: "10:00 PM",
            value: "22:00"
        },
        start_price:{label:'Select',value:0},
        end_price:{label:'Select',value:0},
        city_id:0,
        locality_id:0
    }


    this.postData=this.defaultValue;

    this.getData=function()
    {
        return self.postData;
    }

    this.setData=function(data)
    {
        for(var key in data)
        {
            self.postData[key]=data[key];
        }

    }

    this.post=function(){
        $ionicLoading.show();
        var defer = $q.defer();
        var saloonList = localFactory.post('saloon_list', self.postData);
        saloonList.success(function (data) {
            self.saloonListData=data.saloon_details;
            defer.resolve(data);
            $ionicLoading.hide();
        });

        saloonList.error(function (data, status, headers, config) {
            defer.reject(data);
        });
        return defer.promise;
    }

});

app.service("paypal",function()
{
    var self=this;
    this.paymentData={
        amount:0,
        currencyType:"USD",
        marchentName:"Test"
    }

    this.setData=function(obj){
        self.paymentData=obj;
    }

    this.clientIDs = {
        "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
        "PayPalEnvironmentSandbox": "YOUR_SANDBOX_CLIENT_ID"
    };

    this.init=function(){

        PayPalMobile.init(self.clientIDs, self.onPayPalMobileInit);
    }

    this.onPayPalMobileInit=function(){
        //alert(JSON.stringify(self.configuration()));
        // must be called
        // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
        PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", self.configuration(),
            self.onPrepareRender);
    }

    this.onAuthorizationCallback=function(authorization) {
        console.log("authorization: " + JSON.stringify(authorization, null, 4));
    }

    this.createPayment=function() {
        // for simplicity use predefined amount
        var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
        var payment = new PayPalPayment(self.paymentData['amount'],self.paymentData['currencyType'],self.paymentData['marchentName'], "Sale",
            paymentDetails);
        return payment;
    }

    this.configuration=function() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({
            merchantName: "My test shop",
            merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
            merchantUserAgreementURL: "https://mytestshop.com/agreement"
        });
        return config;
    }

    this.uiPayment=function(onSuccess,onCanceled){
        // single payment
        PayPalMobile.renderSinglePaymentUI(self.createPayment(), onSuccess,
            onCanceled);
    }
});

app.service("facebook",function()
{
    var self=this;
    self.facebookUserId="";
    self.userDetail={}
    this.login=function(fbLoginSuccess,error)
    {
        facebookConnectPlugin.login(["email","public_profile"],
            fbLoginSuccess,
            error
        );
    }

    this.fbGetUserDetail=function(facebookUserId,successData,error)
    {
        facebookConnectPlugin.api(facebookUserId+"/?fields=id,email,name,locale", ["public_profile","email","contact_email"],
            successData,
            error
        );
    }

    this.getLoginStatus=function(success,error)
    {
        facebookConnectPlugin.getLoginStatus(
            success,error);
    }
});

app.service("gpscheck",function(){

    var gpsDetect = cordova.require('cordova/plugin/gpsDetectionPlugin');
    this.checkGPS=function(success,error)
    {
        gpsDetect.checkGPS(success, error);
    }

});

app.service( 'HardwareBackButtonManager', function($ionicPlatform){
    this.deregister = undefined;

    this.disable = function(){
        this.deregister = $ionicPlatform.registerBackButtonAction(function(e){
            e.preventDefault();
            return false;
        }, 101);
    }

    this.enable = function(){
        if( this.deregister !== undefined ){
            this.deregister();
            this.deregister = undefined;
        }
    }
    return this;
})
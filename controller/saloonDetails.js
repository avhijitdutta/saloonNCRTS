app.controller('saloonDetails',['$scope','$compile','$stateParams','$ionicScrollDelegate',function($scope,$compile,$stateParams,$ionicScrollDelegate){
    $scope.showMap=false;
    $scope.toggleMap=function(){
        if(!$scope.showMap){
            $scope.showMap=true;
            var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });

            $scope.map = map;

        }else{

            $scope.showMap=false;
        }
    }

    $scope.saloonDetails="";
    for(var i=0;i<salonList.length;i++){
        if($stateParams.id==salonList[i]['id']){
            $scope.saloonDetails=salonList[i];
            break;
        }
    }

    $scope.toggleFev=function(value){
        if(value){
            $scope.saloonDetails.is_fev=false;
        }else{
            $scope.saloonDetails.is_fev=true;
        }
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
    $scope.openTab = function (tab) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
        $ionicScrollDelegate.resize();
    }

    console.log($scope.saloonDetails);
}])

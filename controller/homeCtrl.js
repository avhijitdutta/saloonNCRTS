app.controller('homeCtrl',['$scope','userService',function($scope,userService){
     $scope.slideHasChanged=function(){

     }
     //console.log(userService.getData().categories);
     $scope.cateList=[
         {id:1,name:"Cuts & Styling",icon:'icon-styling.png'},
         {id:2,name:"Foot & Hand Care ",icon:'icon-foot-handcare.png'},
         {id:3,name:"Extensions",icon:'icon-extensions.png'},
         {id:4,name:"Hair Color",icon:'icon-hair-color.png'},
         {id:5,name:"Make-up",icon:'icon-makeup.png'},
         {id:6,name:"Waxing",icon:'icon-waxing.png'},
         {id:7,name:"Beauty Enhancement",icon:'icon-be.png'},
         {id:8,name:"Massages & SPA Treatment",icon:'icon-msg-spa-treatment.png'}
     ]
}])

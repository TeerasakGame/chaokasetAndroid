angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.name = localStorage.getItem('name');
//$scope.login = localstorage.getItem(login);
var path = localStorage.getItem('pic');
$scope.pic = ip_server+path;
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LoginCtrl',function($scope, $cordovaOauth, $http, $state,$ionicViewService){
/*  $ionicViewService.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });*/
  //ปรพกาศตัวแปรเป็น obj เอาไว้ใส่ค่า user
$scope.error="";
  $scope.user = { username: '', password : ''};
  var check = localStorage.getItem('login');
  //alert(check);

  if(check === true || check === "true"){
    //alert("login แล้ว");
    $state.go("app.crop");
  }


  // ฟังก์ชั่นรับตัวแปรจาก form
  $scope.doLogin = function(form) {
    //ถ้าส่งข้อมูลมาครบ
    if(form.$valid) {
      console.log('Sign-In');
      // send login data
     var data = "email="+$scope.user.username+"&password="+$scope.user.password;
     //console.log(data);
     var ip = ip_server+'/index.php/services/login';
    // alert(ip);
     console.log(ip);
      $http.post(ip, data, config)
        .success(function (data, status, headers, config) {
          //  alert(JSON.stringify(data.data.name));
            if(data.status === true){
              console.log("log in true");
              $scope.error = "";
              localStorage.setItem('login',true);
              localStorage.setItem('name',data.data.name);
              localStorage.setItem('pic',data.data.pic);
              localStorage.setItem('id',data.data.idUser);
              $state.go("app.crop");
            //  alert("TRUE");
            }else{
              $scope.error = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            //  alert("FALSE");
            }
        })
        .error(function (data, status, header, config) {
            //alert("error: "+JSON.stringify(data) );
            console.log("login error");
            $scope.error = "ติดต่อ server ไม่ได้";
            alert($scope.error);
            //$state.go("app.login");
        });
        /*$scope.dataa = Auth.login($scope.user.username,$scope.user.password);
        alert("aaaaa : "+JSON.stringify($scope.dataa));*/
    }
  };

  $scope.LoginFacebook = function(){
    console.log("LoginFacebook");
    $cordovaOauth.facebook(id_Facebook, ["email","public_profile"]).then(function(result) {
            //alert( JSON.stringify(result));
            //alert(result.access_token);
            var token = result.access_token;
          //  alert(token);
            var urlna = "https://graph.facebook.com/v2.7/me?fields=id%2Cname%2Cemail%2Cpicture&access_token="+token;

            $http.get(urlna).then(function(response) {
            //  alert("API OK : "+JSON.stringify(response));
              //  $scope.aaa =  JSON.stringify(response);
              var fullname = response.data.name;
              var email = response.data.email;
              var facebookid = response.data.id;
              //alert(fullname+email+facebookid+"////"+token);
              var ip = ip_server+"/index.php/services/loginfacebook";
            //  alert(ip);
              var data = "name="+fullname+"&email="+email+"&token="+token+"&acter=1&id="+facebookid;
            //  alert(data);
              $http.post(ip, data, config)
                .success(function (data, status, headers, config) {
                    if(data.status === true){
                    //  alert("TRUE");
                      var check = localStorage.getItem('login');
                    //  alert(data.data.idUser);
                      localStorage.setItem('login',true);
                      localStorage.setItem('name',data.data.name);
                      localStorage.setItem('pic',data.data.pic);
                      localStorage.setItem('id',data.data.idUser);
                      $state.go("app.crop");
                    }else{
                      alert("FALSE");
                    }
                }).error(function (data, status, header, config) {
                    //alert("error: "+JSON.stringify(data) );
                    console.log("login error");
                    $scope.error = "ติดต่อ server ไม่ได้";
                    alert($scope.error);
                    //$state.go("app.login");
                });
              //$state.go("app.crop");
            },function(error) {
              alert("error API : "+JSON.stringify(error));
            //  $scope.aaa = "error";
            });
        }, function(error) {
            // error
            alert(error);
        });
  };
})

.controller('RegisterCtrl',function($scope,$compile,$state,$ionicActionSheet,$cordovaCamera,$http,$cordovaFileTransfer){
  $scope.Tels = [{id: 'tel1'}];
  $scope.register = { name: '', lname : '',email:'',password:''};
  $scope.addTel = function(){
    if ($scope.Tels.length < 3){
      var newItemNo = $scope.Tels.length+1;
      $scope.Tels.push({'id':'choice'+newItemNo});
    }else {
      console.log("no add");
    }

  };
  $scope.Remove = function(){
    if($scope.Tels.length <= 1){
      console.log("no remove");
    }else {
      var newItemNo = $scope.Tels.length-1;
      console.log("remove: "+newItemNo);
      $scope.Tels.pop();
    }

  };

  $scope.image = "img/Add_Image.png";
  $scope.showDetail = function() {
    $ionicActionSheet.show({
      //titleText: 'การนำเข้ารูป',
      buttons: [
        { text: '<center>จากเครื่อง</center>' },
        { text: '<center>จากกล้อง</center>' },
      ],
      cancelText: 'ยกเลิก',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
          switch (index) {
            case 0:
            //  alert("111");
              var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    correctOrientation: true,
                  //  encodingType: Camera.EncodingType.JPEG,
                    quality: 100,
                    allowEdit: true,
                    popoverOptions: CameraPopoverOptions,
                    targetWidth: 400,
                    targetHeight: 400,

                  }
              $cordovaCamera.getPicture(options).then(function(imageData){
                $scope.image = imageData;
                $scope.pic = imageData;
              //  $scope.image = "data:image/jpeg;base64," + imageData;

              },function(err){

              });
              break;
            case 1:
                //alert("222");
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                  //  encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 400,
                    targetHeight: 400,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    correctOrientation:true,

                    };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                $scope.image = imageData;
                $scope.pic = imageData;
                }, function(err) {
                // error
                });
              break;
          }
        console.log('BUTTON CLICKED', index);
        return true;
      },
    });
  };

  $scope.doRegister = function(form){
    if(form.$valid) {
      //alert("ok");
      console.log($scope.register);
      console.log($scope.Tels);
      //var tel = $scope.Tels.data;
      //console.log("tel : "+$scope.Tels.length);
      var tel = [];
      datatel = "";
      for (i = 0; i < $scope.Tels.length; i++) {
        //tel.push($scope.Tels[i].data);
        tel[i] =  $scope.Tels[i].data;
        datatel = datatel+"&tel["+i+"]="+tel[i];
      }
      console.log(tel);
    //  $scope.image = $scope.image.toString();
      var data = "name="+$scope.register.name+"&lname="+$scope.register.lname+"&email="+$scope.register.email+"&pic="+$scope.image+"&acter=1&password="+$scope.register.password+datatel;
      console.log($scope.pic);
      //alert("phone : "+$scope.pic);
    //  alert($scope.image.length);
      var ip = ip_server+'/index.php/services/register';
      console.log(ip);
      //alert(ip);
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
           alert("server ok: "+JSON.stringify(data.data));
           $scope.id = data.data.idUser;
           var options = {
                   fileKey: "file",
                   fileName: "image.jpg",
                   chunkedMode: false,
                   mimeType: "image/jpg",
                   headers:{'headerParam':'headerValue'},
                   httpMethod:"POST",
                   params : {'id':$scope.id}
               };
           //var server = "http://172.18.6.120/index.php/services/file";
           var server = ip_server+"/upload/profile/upload.php";
           var filePath = $scope.pic;
           $cordovaFileTransfer.upload(encodeURI(server), filePath, options)
               .then(function(result) {
                 // Success!
                // alert("Success : "+JSON.stringify(result.response));
                 //$scope.datar = result;
               }, function(err) {
                 // Error
                 alert("ERROR : "+JSON.stringify(err));
               }, function (progress) {
                 // constant progress updates
               });

               if(data.status === true){
                // alert("TRUE");
                 var check = localStorage.getItem('login');
                 alert(data.data.idUser);
                 localStorage.setItem('login',true);
                 localStorage.setItem('name',data.data.name);
                 localStorage.setItem('pic',data.data.pic);
                 localStorage.setItem('id',data.data.idUser);
                 $state.go("app.crop");
               }else{
                 alert("FALSE");
               }
         })
         .error(function (data, status, header, config) {
             //alert("error: "+JSON.stringify(data) );
             console.log("login error");
             $scope.error = "ติดต่อ server ไม่ได้ 555";
             alert($scope.error);
             //$state.go("app.login");
         });
    }
  };



})

.controller('CropCtrl',function($scope, $http, $state, $ionicViewService){
  $ionicViewService.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

/*  $scope.name = localStorage.getItem('name');
  var path = localStorage.getItem('pic');
  $scope.pic = ip_server+path;*/

  $scope.myVar = 'closed';
  var data = "use_id="+localStorage.getItem('id');
  //console.log(data);
  var ip = ip_server+'/index.php/services/getcrop';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         //alert(JSON.stringify(data.data));
         $scope.api = data.data;
     })
     .error(function (data, status, header, config) {
         //alert("error: "+JSON.stringify(data) );
         console.log("login error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
         //$state.go("app.login");
     });


  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.doRefresh = function() {
    var data = "use_id="+localStorage.getItem('id');
    //console.log(data);
    var ip = ip_server+'/index.php/services/getcrop';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           //alert(JSON.stringify(data.data));
           $scope.api = data.data;
       })
       .error(function (data, status, header, config) {
           //alert("error: "+JSON.stringify(data) );
           console.log("login error");
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
           //$state.go("app.login");
       }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
  console.log('Crop');
  $scope.add = function(){
    console.log("add crop fn");
    $state.go("app.addCrop");
  }
})

.controller('LogoutCtrl', function($state) {
  alert("logout");
   localStorage.removeItem('name');
   localStorage.removeItem('login');
   localStorage.removeItem('pic');
   localStorage.removeItem('id');
 /*  localStorage.setItem('name',"");
   localStorage.setItem('login',"");
   localStorage.setItem('pic',"");
   localStorage.setItem('id',"");*/
   $state.go("login");
})

.controller('AddCropCtrl',function($state,$ionicModal,$scope,$cordovaGeolocation,$http){
  console.log('add crop');
  $scope.crop = { name: '', seed: '', plan:'',rai:'',nan:'',wa:'',lat:'',long:'',plant:''};
  $scope.seeds = [];
  $scope.plans = [];
  $scope.location = [];
  $http.get(ip_server+'/index.php/services/getplant_select').then(function(res){
    $scope.plants = res.data;
  });
  $scope.choseplant = function(){
    //alert($scope.crop.plant);
    $http.get(ip_server+'/index.php/services/getseed_select/'+$scope.crop.plant).then(function(res_seed){
      $scope.seeds = res_seed.data;
      //$scope.plans = [{"pla_id": "","pla_name": "","pla_detail": "","pla_time": "","seed_id": ""}];
    });
  };

  $scope.choseseed = function(){
    //alert($scope.crop.seed);
    $http.get(ip_server+'/index.php/services/getplan_select/'+$scope.crop.seed).then(function(res_plan){
      $scope.plans = res_plan.data;
    });
  };

  $ionicModal.fromTemplateUrl('templates/map.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeMap = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.map = function() {
  //  alert("MAP : "+$scope.lat+"  "+$scope.long);

  var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "คุณอยู่ที่นี่ !"
      });
      infoWindow.open($scope.map, marker);

      $scope.click_map = function(){
          google.maps.event.addListenerOnce($scope.map,"click",function(position){
            marker.setMap(null);
            marker = new google.maps.Marker({
              map : $scope.map,
              anitmation : google.maps.Animation.DROP,
              position : position.latLng
            });
            $scope.map.panTo(position.latLng);
            $scope.lat = position.latLng.lat();
            $scope.long = position.latLng.lng();
            $scope.location = $scope.lat+"  "+$scope.long;
          });
        }

    }, function(error){
      console.log("Could not get location");
      alert("กรุณาเปิด GPS");
    });
    $scope.modal.show();
  };

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

 $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
     $scope.lat = position.coords.latitude
     $scope.long = position.coords.longitude
     $scope.location = $scope.lat+"  "+$scope.long;
   }, function(err) {
      alert("กรุณาเปิด GPS");
   });

   $scope.doSummit = function(form){
     if(form.$valid) {

     }
   };
})

.controller('CropDetailCtrl',function($scope){
  console.log('Detail');
})

.controller('CropTimelineCtrl',function($scope, $state){
  $scope.timeline = [{
     date: new Date(),
     title: "การเตรียมดิน",
     author: "วันที่ 1 ส.ค.59 - 10 ส.ค.59",
     profilePicture: "img/chaokaset_logo.png",
     Picture:"true",
     text: "รายละเอียด",
     a:'0',
     type: "picture"

   }, {
     date: new Date(),
     title: "กู้เงิน",
     author: "วันที่ 2 ส.ค.59",
     profilePicture: "",
     Picture:"false",
     text: "รายละเอียด",
     a:'1',
     type: "video"

   }, {
     date: new Date(),
     title: "เพลี้ยลง",
     author: "วันที่ 10 ส.ค.59",
     profilePicture: "img/chaokaset_logo.png",
     Picture:"true",
     text: "รายละเอียด",
     a:'1',
     type: "location"

   }, {
     date: new Date(),
     title: "เอาน้ำเข้านา",
     author: "วันที่ 12 ส.ค.59",
     profilePicture: "img/chaokaset_logo.png",
     Picture:"5555",
     text: "รายละเอียด",
     a:'1',
     type: "picture"
   }]
   $scope.addActivities = function(){
     console.log("add Act");
     $state.go("app.addActivities");
   };

   $scope.addAccount = function(){
     $state.go("app.addAccount");
   };

   $scope.addProblem = function(){

     $state.go("app.addProblem");
   };

   $scope.settingsTimeline = function(){
     $state.go("app.settingsTimeline");
   };

})

.controller('CropAccountCtrl',function(){

})

.controller('CropProblemCtrl',function(){

})




.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$cordovaGeolocation) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.beforeEnter', function(e) {
    $scope.name = localStorage.getItem('name');
    var path = localStorage.getItem('pic');
    $scope.pic = ip_server+path;

  });

  var posOptions = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
    localStorage.setItem('lat',position.coords.latitude);
    localStorage.setItem('long', position.coords.longitude);
    console.log("get gps "+localStorage.getItem('lat')+"/"+localStorage.getItem('long'));
   });



})

.controller('LoginCtrl',function($scope, $cordovaOauth, $http, $state, $ionicPlatform){
  //ปรพกาศตัวแปรเป็น obj เอาไว้ใส่ค่า user
  $scope.$on('$ionicView.beforeEnter', function(){
    var check = localStorage.getItem('login');
    if(check === true || check === "true"){
      $state.go("app.crop");
    }
  })

  $scope.error="";
  $scope.user = { username: '', password : ''};

  $scope.check = function(){
    var data = "email="+$scope.user.username;
    var ip = ip_server+'/index.php/services/checkemaillogin';
    $http.post(ip, data, config)
      .success(function (data, status, headers, config) {
        console.log(data.status);
          if(data.status == true){
            if(data.data == 1){
              $scope.erroremail = "อีเมลนี้สมัครสมาชิกผ่าน facebook กรุณาเข้าสู่ระบบด้วย facebook";
            }
          }
      })
      .error(function (data, status, header, config) {
          console.log("check error");
      });

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
     console.log(ip);
      $http.post(ip, data, config)
        .success(function (data, status, headers, config) {
            if(data.status === true){
              console.log("log in true");
              $scope.error = "";
              localStorage.setItem('login',true);
              localStorage.setItem('name',data.data.name);
              localStorage.setItem('pic',data.data.pic);
              localStorage.setItem('id',data.data.idUser);
              $state.go("app.crop");
            }else{
              $scope.error = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            }
        })
        .error(function (data, status, header, config) {
            console.log("login error");
            $scope.error = "ติดต่อ server ไม่ได้";
            alert($scope.error);
        });
    }
  };

  $scope.LoginFacebook = function(){
    console.log("LoginFacebook");
    $cordovaOauth.facebook(id_Facebook, ["email","public_profile"]).then(function(result) {
            var token = result.access_token;
            var urlna = "https://graph.facebook.com/v2.7/me?fields=id%2Cname%2Cemail%2Cpicture&access_token="+token;

            $http.get(urlna).then(function(response) {
              var fullname = response.data.name;
              var email = response.data.email;
              var facebookid = response.data.id;
              var ip = ip_server+"/index.php/services/loginfacebook";
              var data = "name="+fullname+"&email="+email+"&token="+token+"&acter=1&id="+facebookid;
              $http.post(ip, data, config)
                .success(function (data, status, headers, config) {
                    if(data.status === true){
                      var check = localStorage.getItem('login');
                      localStorage.setItem('login',true);
                      localStorage.setItem('name',data.data.name);
                      localStorage.setItem('pic',data.data.pic);
                      localStorage.setItem('id',data.data.idUser);
                      $state.go("app.crop");
                    }else{

                    }
                }).error(function (data, status, header, config) {
                    console.log("login error");
                    $scope.error = "ติดต่อ server ไม่ได้";
                    alert($scope.error);
                });
            },function(error) {
              alert("error API : "+JSON.stringify(error));
            });
        }, function(error) {
            alert(error);
        });
  };

  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="login"){
        navigator.app.exitApp(); //<-- remove this line to disable the exit
    }else {
      navigator.app.backHistory();
    }
  }, 100);
})

.controller('RegisterCtrl',function($scope,$compile,$state,$ionicActionSheet,$cordovaCamera,$http,$cordovaFileTransfer,$ionicPlatform){
  $scope.Tels = [{id: 'tel1'}];
  $scope.register = { name: '', lname : '',email:'',password:''};
  $scope.pic = "";
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
              var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    correctOrientation: true,
                    quality: 30,
                    allowEdit: true,
                    popoverOptions: CameraPopoverOptions,
                    targetWidth: 400,
                    targetHeight: 400,

                  }
              $cordovaCamera.getPicture(options).then(function(imageData){
                $scope.image = imageData;
                $scope.pic = imageData;
              },function(err){

              });
              break;
            case 1:
                var options = {
                    quality: 30,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
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
      console.log($scope.register);
      console.log($scope.Tels);
      var tel = [];
      var datatel = "";
      for (i = 0; i < $scope.Tels.length; i++) {
        tel[i] =  $scope.Tels[i].data;
        datatel = datatel+"&tel["+i+"]="+tel[i];
      }
      console.log(tel);
      var data = "name="+$scope.register.name+"&lname="+$scope.register.lname+"&email="+$scope.register.email+"&pic="+$scope.image+"&acter=1&password="+$scope.register.password+datatel;
      console.log($scope.pic);
      var ip = ip_server+'/index.php/services/register';
      console.log(ip);
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
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
           var server = ip_server+"/upload/profile/upload.php";
           var filePath = $scope.pic;
           $cordovaFileTransfer.upload(encodeURI(server), filePath, options)
               .then(function(result) {
                 // Success!
               }), function(err) {
                 // Error
                 alert("ERROR : "+JSON.stringify(err));
               }
               if(data.status === true){
                 var check = localStorage.getItem('login');
                 localStorage.setItem('login',true);
                 localStorage.setItem('name',data.data.name);
                 localStorage.setItem('pic',data.data.pic);
                 localStorage.setItem('id',data.data.idUser);
                 $state.go("app.crop");
               }else{
                $scope.err = data.data;
               }
         }).error(function (data, status, header, config) {
             console.log("login error");
             $scope.error = "ติดต่อ server ไม่ได้";
             alert($scope.error);
         });
    }
  };
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("login");
  }, 100);

})


.controller('CropCtrl',function($scope, $http, $state,$ionicPopup,$ionicLoading,$ionicPlatform,$ionicHistory,$ionicSideMenuDelegate,$ionicNavBarDelegate,$cordovaToast){

$ionicNavBarDelegate.showBackButton(false);

console.log("crop");
  $scope.doRefresh = function() {
    var data = "use_id="+localStorage.getItem('id');
    var ip = ip_server+'/index.php/services/getcrop';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.api = data.data;
            console.log($scope.api);
           if( $scope.api == '' ||  $scope.api == null){

             $scope.alert = "";
           }
       })
       .error(function (data, status, header, config) {
           console.log("login error");
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
       }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.$on('$ionicView.beforeEnter', function(){
    var num = 1;

    $ionicPlatform.registerBackButtonAction(function () {
      if(num < 2){
         $cordovaToast.showShortBottom('กดอีกครั้งเพื่อออก');
         num++;
      }else{
        if($state.current.name=="app.crop"){
            navigator.app.exitApp(); //<-- remove this line to disable the exit
        }else {
          navigator.app.backHistory();
        }
      }

    }, 100);

    localStorage.removeItem('crop_id');
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });
    var data = "use_id="+localStorage.getItem('id');
    //console.log(data);
    var ip = ip_server+'/index.php/services/getcrop';
    $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          $scope.api = data.data;
          if( $scope.api == '' ||  $scope.api == null){
            console.log("555");
            $scope.alert = "";
          }
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           $ionicLoading.hide();
           alert($scope.error);
       });
   });

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.add = function(){
    //console.log("add crop fn");
    $state.go("app.addCrop");
  }
  $scope.edit = function(id) {
    $state.go("app.editcrop",{id:id});
  }
  $scope.cropTimeline = function(id) {
    localStorage.setItem('crop_id',id);
    $state.go("app.tab.cropTimeline");
  }
  $scope.del = function(id,index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'ยืนยันการลบ',
      template: 'คุณต้องการลบข้อมูลนี้ ?',
      cancelText: 'ยกเลิก',
      okText: 'ตกลง'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var data = "id="+id;
        var ip = ip_server+'/index.php/services/delcrop';
        $http.post(ip, data, config).success(function (data, status, headers, config) {
          $scope.api.splice(index,1);
        }).error(function (data, status, header, config) {
          $scope.error = "ติดต่อ server ไม่ได้";
          alert($scope.error);
        })

      } else {
        console.log('You are not sure');
      }
    })
  };




})

.controller('LogoutCtrl', function($state) {
   alert("logout");
   localStorage.removeItem('name');
   localStorage.removeItem('login');
   localStorage.removeItem('pic');
   localStorage.removeItem('id');
   localStorage.removeItem('crop_id');
   localStorage.removeItem('lat');
   localStorage.removeItem('long');
   $state.go("login");
})

.controller('AddCropCtrl',function($state,$ionicModal,$scope,$cordovaGeolocation,$http,$ionicLoading,$ionicHistory,$ionicPlatform){
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังค้นหาพิกัดที่อยู่'
    });
  console.log('add crop');
  $scope.crop = { name: '',rai:0,nan:0,wa:null};
  if(localStorage.getItem('lat') == null || localStorage.getItem('long') == null){
    console.log("lat long null");
    var posOptions = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
       $scope.lat = position.coords.latitude
       $scope.long = position.coords.longitude
       $scope.location = $scope.lat +"  "+$scope.long;
       $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
         $scope.namelatlong = res.data;
         $ionicLoading.hide();
       });

     }, function(err) {
       $ionicLoading.hide();
      alert("กรุณาเปิด GPS");
      cordova.plugins.diagnostic.switchToLocationSettings();
      $ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
     });
  }else {
    $scope.lat = localStorage.getItem('lat');
    $scope.long = localStorage.getItem('long');
    $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
      $scope.namelatlong = res.data;
      $ionicLoading.hide();
    });
  }

  $http.get(ip_server+'/index.php/services/plant').then(function(res){
    $scope.test = res.data;
    $scope.plant = res.data[0];
    $scope.seed = res.data[0]['seed'][0];
    $scope.plan = res.data[0]['seed'][0]['plan'][0];
  });

  })

  $scope.changeseed = function(id){
    $scope.seed = {seed_id:id};
  }
  $scope.changeplan = function(id){
    $scope.plan = {plan_id:id};
  }

  $scope.doSummit = function(form){
    if(form.$valid) {
      $scope.user = localStorage.getItem('id');
      var data = "name="+$scope.crop.name+"&id_user="+$scope.user+"&seed="+$scope.seed.seed_id+"&plan="+$scope.plan.plan_id+"&rai="+$scope.crop.rai+"&nan="+$scope.crop.nan+"&wa="+$scope.crop.wa+"&lat="+$scope.lat+"&long="+$scope.long;
      var ip = ip_server+'/index.php/services/addcrop';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        $ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
       }).error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
      });
    }
  };

  $scope.map_name = "กำหนดพื้นที่แปลง";

  $ionicModal.fromTemplateUrl('templates/map.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeMap = function() {
    $scope.modal.hide();
  };

  $scope.map = function() {
    $scope.modal.show();
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });
    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      var latLng = new google.maps.LatLng(lat,long);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      //$scope.map = v2.map;
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "คุณอยู่ที่นี่ !"
      });
      infoWindow.open(map, marker);
      $scope.click_map = function(){
          google.maps.event.addListenerOnce(map,"click",function(position){
            marker.setMap(null);
            marker = new google.maps.Marker({
              map : map,
              anitmation : google.maps.Animation.DROP,
              position : position.latLng
            });
            map.panTo(position.latLng);
            $scope.lat = position.latLng.lat();
            $scope.long = position.latLng.lng();
            $scope.location = $scope.lat +"  "+$scope.long ;
            $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
              $scope.namelatlong = res.data;
            });
          });
        }
      $ionicLoading.hide();
    }, function(error){
      console.log("Could not get location");
      alert("กรุณาเปิด GPS");
    });

  };

  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);

})

.controller('GetIdCropCtrl',function($state,$stateParams,$scope){
    localStorage.removeItem('crop_id');
    var id = $stateParams.id;
    console.log("id sent => "+id);
    localStorage.setItem('crop_id',id);
    console.log("id set => "+localStorage.getItem('crop_id'));
    $state.go("app.tab.cropTimeline");
})

.controller('CropDetailCtrl',function($scope,$http,$state,$ionicLoading,$filter){
  console.log('Detail');
  $scope.detail = [];

  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
           template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });

  $scope.crop_id = localStorage.getItem('crop_id');
  var data = "crop_id="+$scope.crop_id;
  var ip = ip_server+'/index.php/services/showcrop';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         $ionicLoading.hide();
         $scope.crop = data.data;
         $scope.plan = data.plan;

         var date = new Date();
         var dateend = new Date($scope.crop['end']);
         if(date >= dateend){

           $scope.show = true;
              console.log($scope.show);
           if($scope.crop.crop_status == 0){

             $scope.end = $filter('date')(new Date($scope.crop.real_enddate), "yyyy-MM-dd").toString()
            $scope.value = $filter('date')(Date.now(), "dd-MM-yyyy");
             $scope.detail = {value:parseInt($scope.crop.real_product),dateend:new Date($scope.crop.real_enddate) };
             console.log($scope.detail);
           }else{
             $scope.detail = {value:'',dateend:new Date()};
           }
         }else{
            console.log("not show");
            $scope.show = false;
            $scope.detail = {value:'',dateend:new Date()};
         }

     })
     .error(function (data, status, header, config) {
         $ionicLoading.hide();
         console.log("login error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
     })
    });

    $scope.doSummit = function(form){
      if(form.$valid) {
        console.log($scope.detail);
        var ip = ip_server+"/index.php/services/updatecropend";

        var date = $filter('date')($scope.detail.dateend, 'yyyy-MM-dd HH:mm:ss');
        var data = "id="+localStorage.getItem('crop_id')+"&value="+$scope.detail.value+"&date="+date;
        console.log(data);
        $http.post(ip, data, config).success(function (data, status, headers, config) {
console.log("seve");
          }).error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้";
              alert($scope.error);
          });
      }
    }

    $scope.sell = function(id){
      console.log(id);
      $state.go("app.addpic",{id:id,img:null});
    }
})

.controller('CropTimelineCtrl',function($ionicPlatform,$scope,$state,$http,$ionicActionSheet,$cordovaImagePicker,$filter,$cordovaFileTransfer,$ionicLoading,$cordovaCamera,$ionicPopup,$window){
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
           template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });

  $scope.items = [{src:"img/ionic.png"},{src:"img/ionic.png"}];
  $scope.crop_id = localStorage.getItem('crop_id');
  var data = "crop_id="+$scope.crop_id;
  var ip = ip_server+'/index.php/services/showplan';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         $scope.timeline= data.data;

         $ionicLoading.hide();
     })
     .error(function (data, status, header, config) {
        $ionicLoading.hide();
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
     });
});
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

   $scope.addMul = function(){
     $state.go("app.addmultimedia");
   };

   $scope.addNote = function(){
      $state.go("app.addnote");
   };

   $scope.openvdo = function(url){
     $window.open(url,'_system', 'location=yes');
   }


   $scope.showDetail = function(id,data,status,i) {
     if (status === 'false' || status === false){
       $scope.botton = [{ text: '<center><div>แสดงข้อมูล</div></center>' },
      { text: '<center>แก้ไข</i></center>' },
      { text: '<center> ลบ</i></center>' },];
     }else{
       $scope.botton = [{ text: '<center><div>ซ่อนข้อมูล</div></center>' },
      { text: '<center> แก้ไข</i></center>' },
      { text: '<center> ลบ</i></center>' },];
     }
     $ionicActionSheet.show({

       buttons:  $scope.botton ,

       cancelText: 'ยกเลิก',
       cancel: function() {
         console.log('CANCELLED');
       },
       buttonClicked: function(index) {
           switch (index) {
             case 0:
               $scope.event(i,status,id,data);
               break;
             case 1:
               $scope.edit(i,id,data);
               break;
             case 2:
                $scope.del(i,id,data);
               break;
           }
         console.log('BUTTON CLICKED', index);
         return true;
       },
     });
   };
   $scope.edit = function(index,id,data){
     switch (data) {
       case "plan":
         $state.go("app.editActivities",{id:id},{reload:true});
         break;
       case "account":
         $state.go("app.editAccount",{data:id,redirect:'timeline'},{reload:true});
         break;
      case "problem":
        $state.go("app.editProblem",{cropp_id:id,redirect:'timeline'},{reload:true});
        break;
      case "note":
        $state.go("app.editnote",{id:id},{reload:true});
        break;
      case "multimedia":
        $state.go("app.editmultimedia",{id:id},{reload:true});
        break;
     }
   };
   $scope.del = function(index,id,data){
     switch (data) {
       case "plan":
         var data = "id="+id;
         var ip = ip_server+'/index.php/services/delactivity';
         break;
       case "account":
         var data = "cropa_id="+id;
         var ip = ip_server+'/index.php/services/deleteaccount';
         break;
      case "problem":
        var data = "id="+id;
        var ip = ip_server+'/index.php/services/delproblem';
        break;
      case "note":
        var data = "id="+id;
        var ip = ip_server+'/index.php/services/delnote';
        break;
      case "multimedia":
      var data = "id="+id;
      var ip = ip_server+'/index.php/services/delmul';
        break;
     }

     var confirmPopup = $ionicPopup.confirm({
       title: 'ยืนยันการลบ',
       template: 'คุณต้องการลบข้อมูลนี้ ?',
       cancelText: 'ยกเลิก',
       okText: 'ตกลง'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $http.post(ip, data, config).success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.timeline.length; i++) {
              if ($scope.timeline[i].id == id) {
                $scope.timeline.splice(i, 1);
              }
            }
          }).error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้";
              alert($scope.error);
          })
       } else {
         console.log('You are not sure');
       }
     });

   };
   $scope.event = function(index,status,id,topic){
     if (status === 'false' || status === false){
        $scope.timeline[index].status_show = 'true';
     }else{
       $scope.timeline[index].status_show = 'false';
     }
     var data = "id="+id+"&topic="+topic+"&status="+$scope.timeline[index].status_show;
     var ip = ip_server+'/index.php/services/updatestatusshow';
      $http.post(ip, data, config)
        .success(function (data, status, headers, config) {
        })
        .error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้";
        });

   };
   $scope.doRefresh = function() {
     var data = "crop_id="+$scope.crop_id;
     var ip = ip_server+'/index.php/services/showplan';
      $http.post(ip, data, config)
        .success(function (data, status, headers, config) {
            $scope.timeline= data.data;
        })
        .error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้";
            alert($scope.error);
        }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     })
   };
  $scope.images = [];

  $scope.getpic = function(id,index){
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.timeline[index].pic.push({src:results[i]});
          $scope.date = new Date();
          var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
          $scope.name_pic = 'detail_'+localStorage.getItem('id')+'_'+id +'_'+i+date+'.jpg';
          var options = {
                  fileKey: "file",
                  chunkedMode: false,
                  mimeType: "image/jpg",
                  headers:{'headerParam':'headerValue'},
                  httpMethod:"POST",
                  params : {'name_pic':$scope.name_pic},
              };
          var server = ip_server+"/upload/pic/upload_pic.php";
          var filePath = results[i];
          $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {

          }, function(err) {
                // Error
                alert("ERROR : "+JSON.stringify(err));
          }, function (progress) {
                // constant progress updates
          });
          var data = "cropd_id="+id +"&name="+$scope.name_pic;
          var ip = ip_server+'/index.php/services/addpiccrop';
          $http.post(ip, data, config).success(function (data, status, headers, config) {
          }).error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้ uppic";
            alert($scope.error);
          });
        }
      }, function(error) {
        // error getting photos
      });
  }

  $scope.getpiccamera = function(id,index){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,

        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.date = new Date();
      var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
      $scope.name_pic = 'detail_'+localStorage.getItem('id')+'_'+localStorage.getItem('crop_id') +'_0'+date+'.jpg';
      var options = {
              fileKey: "file",
              chunkedMode: false,
              mimeType: "image/jpg",
              headers:{'headerParam':'headerValue'},
              httpMethod:"POST",
              params : {'name_pic':$scope.name_pic},
          };
      var server = ip_server+"/upload/pic/upload_pic.php";
      var filePath =   imageData;
      $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
      }, function(err) {
            // Error
            alert("ERROR : "+JSON.stringify(err));
      }, function (progress) {
            // constant progress updates
      });
      var data = "cropd_id="+localStorage.getItem('crop_id')+"&name="+$scope.name_pic;
    //  alert(data);
      var ip = ip_server+'/index.php/services/addpiccrop';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //ok
      //  alert("uppic ok");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้ uppic";
        alert($scope.error);
      });
      $scope.timeline[index].pic.push({src:imageData});
      //  alert('set_data');
    }, function(err) {
    // error
      alert("ERROR TAKE PIC : "+JSON.stringify(err));
    });

  }



})

.controller('CropAccountCtrl',function($ionicPlatform,$scope,$http,$state,$ionicHistory,$ionicPopup,$ionicLoading){
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.doRefresh = function() {
    $scope.crop_id = localStorage.getItem('crop_id');
    var data = "crop_id="+$scope.crop_id;
    //console.log(data);
    var ip = ip_server+'/index.php/services/showaccaccount';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           //alert(JSON.stringify(data.data));
           $scope.accaccounts = data.data.all;
           $scope.total = data.data.total;
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
/*  $scope.$on("$ionicView.enter", function () {
   $ionicHistory.clearCache();
   //$ionicHistory.clearHistory();
});*/
$scope.$on('$ionicView.beforeEnter', function () {
  $ionicLoading.show({
         template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
  });
  $scope.crop_id = localStorage.getItem('crop_id');
  var data = "crop_id="+$scope.crop_id;
  //console.log(data);
  var ip = ip_server+'/index.php/services/showaccaccount';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         //alert(JSON.stringify(data));
         $ionicLoading.hide();
         if(data.status == false || data.status == "false"){
           $scope.total = {plus: 0,minus: 0,ans: 'plus'};
           $scope.data = "ไม่มีข้อมูล";
         }else{
           $scope.accaccounts = data.data.all;
           $scope.total = data.data.total;
         }


     })
     .error(function (data, status, header, config) {
         //alert("error: "+JSON.stringify(data) );
         $ionicLoading.hide();
         console.log("login error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
         //$state.go("app.login");
     })
  })

    $scope.add = function(){
      $state.go("app.addAccount",{reload:true});
    };
    $scope.edit = function(data){
    //  alert(JSON.stringify(data));
      $state.go("app.editAccount",{data:data},{reload:true});
    };

    $scope.del = function(id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'ยืนยันการลบ',
        template: 'คุณต้องการลบข้อมูลนี้ ?',
        cancelText: 'ยกเลิก',
        okText: 'ตกลง'
      });
      confirmPopup.then(function(res) {
        if(res) {
        //  alert('You are sure');
          var data = "cropa_id="+id;
          //console.log(data);
          var ip = ip_server+'/index.php/services/deleteaccount';
           $http.post(ip, data, config)
             .success(function (data, status, headers, config) {
                 $scope.crop_id = localStorage.getItem('crop_id');
                 var data = "crop_id="+$scope.crop_id;
                 var ip = ip_server+'/index.php/services/showaccaccount';
                  $http.post(ip, data, config)
                    .success(function (data, status, headers, config) {
                        $scope.accaccounts = data.data.all;
                        $scope.total = data.data.total;
                    })
                    .error(function (data, status, header, config) {
                        //alert("error: "+JSON.stringify(data) );
                        console.log("login error");
                        $scope.error = "ติดต่อ server ไม่ได้";
                        alert($scope.error);
                        //$state.go("app.login");
                    })
             })
             .error(function (data, status, header, config) {
                 //alert("error: "+JSON.stringify(data) );
                 console.log("error");
                 $scope.error = "ติดต่อ server ไม่ได้";
                 alert($scope.error);
                 //$state.go("app.login");
             })
        } else {
          console.log('You are not sure');
        }
      });
    };


})

.controller('CropProblemCtrl',function($ionicPlatform,$scope,$http,$state,$ionicHistory,$ionicPopup,$ionicLoading){
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.$on("$ionicView.enter", function () {
   $ionicHistory.clearCache();
   //$ionicHistory.clearHistory();
  });
  $scope.$on('$ionicView.beforeEnter', function () {
    $ionicLoading.show({
           template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.crop_id = localStorage.getItem('crop_id');
  //alert("crop_id : "+$scope.crop_id);
  var data = "crop_id="+$scope.crop_id;
  console.log(data);
  var ip = ip_server+'/index.php/services/showproblem';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         //alert(JSON.stringify(data.data));
         if(data.status == false){
           $scope.data = "ไม่มีข้อมูล";
         }else{
           $scope.problems = data.data;
         }

         console.log($scope.problems);
        // $scope.total = data.total;
        $ionicLoading.hide();
     })
     .error(function (data, status, header, config) {
         //alert("error: "+JSON.stringify(data) );
         $ionicLoading.hide();
         console.log("login error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
         //$state.go("app.login");
     });
    });

     $scope.doRefresh = function() {
       var data = "crop_id="+$scope.crop_id;
       var ip = ip_server+'/index.php/services/showproblem';
        $http.post(ip, data, config)
          .success(function (data, status, headers, config) {
              $scope.problems = data.data;
          })
          .error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้";
              alert($scope.error);
          }).finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       })
     };

     $scope.add = function(){
       $state.go("app.addProblem");
     };

     $scope.del = function(id) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'ยืนยันการลบ',
         template: 'คุณต้องการลบปัญหานี้ ?',
         cancelText: 'ยกเลิก',
         okText: 'ตกลง'
       });
       confirmPopup.then(function(res) {
         if(res) {
         //  alert('You are sure');
           var data = "id="+id;

           var ip = ip_server+'/index.php/services/delproblem';
            $http.post(ip, data, config)
              .success(function (data, status, headers, config) {
                  console.log("delproblem");
                  var data = "crop_id="+$scope.crop_id;
                  var ip = ip_server+'/index.php/services/showproblem';
                   $http.post(ip, data, config)
                     .success(function (data, status, headers, config) {
                         $scope.problems = data.data;
                     })
                     .error(function (data, status, header, config) {
                         $scope.error = "ติดต่อ server ไม่ได้";
                         alert($scope.error);
                     })

              })
              .error(function (data, status, header, config) {
                  //alert("error: "+JSON.stringify(data) );
                  console.log("error");
                  $scope.error = "ติดต่อ server ไม่ได้";
                  alert($scope.error);
                  //$state.go("app.login");
              })
         } else {
           console.log('You are not sure');
         }
       })
     };
     $scope.detail = function(id){
       console.log("detail : "+id);
        $state.go("app.detailProblem",{cropp_id:id});
     }
     $scope.edit = function(id){
       //alert(id);
       $state.go("app.editProblem",{cropp_id:id});
     }
})

.controller('AddAccountCtrl',function($scope,$ionicHistory,$state,$http){


  $scope.account = { status: true,type:"0",num:"",detail:""};
  $scope.close = function(){
    $state.go("app.tab.cropAccount");
  }
  $scope.doSummit = function(form){
    if(form.$valid) {
    //  alert(JSON.stringify($scope.account));
      $scope.crop_id = localStorage.getItem('crop_id');
      var data = "crop_id="+$scope.crop_id+"&num="+$scope.account.num+"&detail="+$scope.account.detail+"&type="+$scope.account.type+"&status="+$scope.account.status;
      console.log(data);
      //alert(JSON.stringify(data));
      var ip = ip_server+'/index.php/services/addaccaccount';
      console.log(ip);
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
           console.log("ok");
           $state.go("app.tab.cropAccount");
       })
         .error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้";
             alert($scope.error);
         });

    }

  };

})

.controller('EditAccountCtrl',function($stateParams,$scope,$http,$state){

  $scope.id = $stateParams.data;
  var redirect = $stateParams.redirect;
  //alert($scope.data);
  $scope.account = { num:""};

  var data = "cropa_id="+$scope.id;
  var ip = ip_server+'/index.php/services/getaccountid';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    $scope.edit = data.data;
    $scope.account.num = parseInt(data.data[0].cropa_amount,10);
    if(data.data[0].cropa_status == '1'){
      $scope.status = true;
    }else{
      $scope.status = false;
    };

  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });
  $scope.close = function(){
    $state.go("app.tab.cropAccount");
  };
  $scope.doSummit = function(form){
    if(form.$valid) {
    //  $scope.account=;
      var data = "cropa_id="+$scope.edit[0].cropa_id+"&num="+$scope.account.num+"&detail="+$scope.edit[0].cropa_name+"&type="+$scope.edit[0].cropa_type+"&status="+$scope.status;
      //alert(data);
      var ip = ip_server+'/index.php/services/editaccount';
       $http.post(ip, data, config).success(function (data, status, headers, config) {
           if(redirect == "timeline"){
             $state.go("app.tab.cropTimeline",{reload:true});
           }else{
             $state.go("app.tab.cropAccount",{reload:true});
           }
       }).error(function (data, status, header, config) {
          $scope.error = "ติดต่อ server ไม่ได้";
          alert($scope.error);
      });
    }
  };

})

.controller('AddActivitiesCtrl',function($scope, $state,$filter,$http,$ionicHistory){

   $scope.date_start = new Date();
   $scope.atv = {name:'',type:1,start:$scope.date_start,end:'',datail:''};

   $http.get(ip_server+'/index.php/services/gettypecrop').then(function(res){
     $scope.types = res.data;
   });

   $http.get(ip_server+'/index.php/services/getdatestart/'+localStorage.getItem('crop_id')).then(function(res){
    // $scope.crop_start = $filter('date')(res.data, 'yyyy-MM-dd');
    $scope.crop_start=  new Date(res.data);
    // alert($scope.crop_start);
   });

   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };

   $scope.close = function(){
     $state.go("app.tab.cropTimeline");
   };


   $scope.doSummit = function(form){
     if(form.$valid) {
       //alert(JSON.stringify($scope.atv));
       var start = $filter('date')($scope.atv.start, 'yyyy-MM-dd');
       var end = $filter('date')($scope.atv.end, 'yyyy-MM-dd');
       var crop_id = localStorage.getItem('crop_id');
       //alert(start+" "+end+" "+crop_id);
       var data = "crop_id="+crop_id+"&name="+$scope.atv.name+"&start="+start+"&end="+end+"&detail="+$scope.atv.datail+"&type="+$scope.atv.type;
       //alert(data);
       var ip = ip_server+'/index.php/services/addactivity';
       $http.post(ip, data, config).success(function (data, status, headers, config) {
        $state.go("app.tab.cropTimeline");
       }).error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
       });
     }
   }
 })

 .controller('AddProblemCtrl',function($scope, $state, $ionicActionSheet, $cordovaCamera, $http, $cordovaImagePicker,$ionicHistory,$cordovaFileTransfer,$filter,$cordovaCamera){

   //$scope.$on("$ionicView.enter", function () {
  //  $ionicHistory.clearCache();
    //$ionicHistory.clearHistory();
  // });
   $scope.problems = {name:"",detail:"",type:1};

   $http.get(ip_server+'/index.php/services/gettypeproblem').then(function(res){
     $scope.types = res.data.data;
   });

   $scope.close = function(){
     $state.go("app.tab.cropProblem");
   };
   $scope.images = [];
   $scope.items = [];

   $scope.getpic = function(id){
     var options = {
       maximumImagesCount: 10,
       quality: 30
     };

     $cordovaImagePicker.getPictures(options)
       .then(function (results) {
         for (var i = 0; i < results.length; i++) {
           console.log('Image URI: ' + results[i]);
           $scope.images.push(results[i]);
           $scope.items.push({src:results[i]});
         }
       }, function(error) {
       });
   };

   $scope.takepic = function(){
     var options = {
         quality: 30,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: Camera.PictureSourceType.CAMERA,
         popoverOptions: CameraPopoverOptions,
         saveToPhotoAlbum: true,
         correctOrientation:true,
         };

     $cordovaCamera.getPicture(options).then(function(imageData) {
     var image = document.getElementById('myImage');
      $scope.images.push(imageData);
      $scope.items.push({src:imageData});
     }, function(err) {
     // error
     });
   };

  $scope.removeItem = function(index){
    $scope.images.splice(index, 1);
  }

   $scope.doSummit = function(form){
     if(form.$valid) {
       var crop_id = localStorage.getItem('crop_id');
       var data = "crop_id="+crop_id+"&name="+$scope.problems.name+"&detail="+$scope.problems.detail+"&type="+$scope.problems.type;
       var ip = ip_server+'/index.php/services/addproblem';
       $http.post(ip, data, config).success(function (data, status, headers, config) {
        //  alert("cropp_id : "+data.data);
          $scope.cropp_id = data.data;
          var len = $scope.images.length;
      //    alert("pic : "+len); //undefined
          if (len > 0){
            for(var i = 0; i < len; i++){
          //    alert("name "+i+" : "+$scope.images[i]);
              $scope.date = new Date();
              var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
              $scope.name_pic = 'problem_'+localStorage.getItem('id')+'_'+$scope.cropp_id +'_'+i+date+'.jpg';

              var options = {
                      fileKey: "file",
                    //  fileName: "image.jpg",
                      chunkedMode: false,
                      mimeType: "image/jpg",
                      headers:{'headerParam':'headerValue'},
                      httpMethod:"POST",
                      params : {'name_pic':$scope.name_pic},
                  };
              var server = ip_server+"/upload/problem/upload_problem.php";
            //  alert(server);
              var filePath = $scope.images[i];
              $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
            //    alert("ok");
              }, function(err) {
                    // Error
                    alert("ERROR : "+JSON.stringify(err));
              }, function (progress) {
                    // constant progress updates
              });
              var data = "cropp_id="+$scope.cropp_id +"&name="+$scope.name_pic;
            //  alert(data);
              var ip = ip_server+'/index.php/services/addpicproblem';
              $http.post(ip, data, config).success(function (data, status, headers, config) {
               //ok
              }).error(function (data, status, header, config) {
                $scope.error = "ติดต่อ server ไม่ได้ uppic";
                alert($scope.error);
              });
            };
          }

          $state.go("app.tab.cropProblem");

       }).error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
       });

     }
   };

 })

 .controller('DetailProblemCtrl',function($scope,$stateParams,$http,$ionicPlatform){

  $ionicPlatform.registerBackButtonAction(function () {
         navigator.app.backHistory();
   }, 100);
  $scope.text = "";
  $scope.items = [];
  $scope.ip_pic = ip_server;
  $scope.id_user = localStorage.getItem('id');
  var id = $stateParams.cropp_id;
  //alert(id);
  var data = "cropp_id="+id;
  var ip = ip_server+'/index.php/services/problemdetail';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    $scope.problem = data.data;
    $scope.items = data.data.pic;
    $scope.chats = data.data.chat;
    $scope.count = data.data.count;
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });

  $scope.send = function(){
    //alert($scope.text);
    var data = "cropp_id="+id+"&text="+$scope.text+"&use_id="+$scope.id_user;
    var ip = ip_server+'/index.php/services/addansproblem';
    $http.post(ip, data, config).success(function (data, status, headers, config) {
      $scope.chats = data.data;
      $scope.count = data.count;
    }).error(function (data, status, header, config) {
      $scope.error = "ติดต่อ server ไม่ได้";
      alert($scope.error);
    });
    $scope.text = "";
  }



 })

.controller('EditProblemCtrl', function($stateParams,$scope,$http,$cordovaImagePicker,$state,$cordovaFileTransfer,$filter,$cordovaCamera){
  //$scope.problems = [{name:''}];

  $scope.cropp_id = $stateParams.cropp_id;
  var redirect = $stateParams.redirect;
$scope.images =[];
  //$scope.problems = {detail:"xx"};
  $http.get(ip_server+'/index.php/services/gettypeproblem').then(function(res){
    $scope.types = res.data.data;
  });
  var data = "cropp_id="+$scope.cropp_id;
  var ip = ip_server+'/index.php/services/problemdetailid';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    $scope.problem = data.data;
    $scope.images = data.pic;
    //var types = $scope.problem.tpro_id;

  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });

  $scope.getpic = function(id){
    //alert("ok : "+id);
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push({src:results[i],id:null});
        }
      }, function(error) {
        // error getting photos
      });
  };
  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    var image = document.getElementById('myImage');
     //$scope.images.push(imageData);
     $scope.images.push({src:imageData,id:null});

    }, function(err) {
    // error
    });
  };


  $scope.removeItem = function(index){
    //alert($scope.images[index].id);
    if($scope.images[index].id == null){
      $scope.images.splice(index, 1);
    }else {
      var data = "ppb_id="+$scope.images[index].id;
      var ip = ip_server+'/index.php/services/delpicproblem';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //ok
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
      $scope.images.splice(index, 1);
    }
  }

  $scope.close = function(){
    $state.go("app.tab.cropProblem");
  };

  $scope.doSummit = function(form){
    if(form.$valid) {
    //  alert(JSON.stringify($scope.problem));
    //  alert(JSON.stringify($scope.images));
      var data = "cropp_id="+$scope.problem.cropp_id+"&name="+$scope.problem.cropp_name+"&type="+$scope.problem.tpro_id+"&detail="+$scope.problem.cropp_detail;
      var ip = ip_server+'/index.php/services/editproblem';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //$state.go("app.tab.cropProblem");
        $scope.cropp_id = data.data;
        //alert($scope.cropp_id);
        var len = $scope.images.length;
      //  alert("len :"+len);
        if (len > 0){
          for(var i = 0; i < len; i++){
            if($scope.images[i].id == null){
              //alert("img : "+JSON.stringify($scope.images[i]));
              //alert($scope.cropp_id);
              $scope.date = new Date();
              var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
              $scope.name_pic = 'problem_'+localStorage.getItem('id')+'_'+$scope.cropp_id+'_'+i+date+'.jpg';

            //  alert($scope.name_pic);
              var options = {
                      fileKey: "file",
                      chunkedMode: false,
                      mimeType: "image/jpg",
                      headers:{'headerParam':'headerValue'},
                      httpMethod:"POST",
                      params : {'name_pic':$scope.name_pic},
                  };
              var server = ip_server+"/upload/problem/upload_problem.php";
            //  alert(server);
              var filePath = $scope.images[i].src;
            //  alert(filePath);
              $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
                //alert("ok up");
              }, function(err) {
                    // Error
                    alert("ERROR : "+JSON.stringify(err));
              }, function (progress) {
                    // constant progress updates
              });
              var data = "cropp_id="+$scope.cropp_id+"&name="+$scope.name_pic;
            // alert(data);
              var ip = ip_server+'/index.php/services/addpicproblem';
              $http.post(ip, data, config).success(function (data, status, headers, config) {
              //  alert("ok add");
              }).error(function (data, status, header, config) {
                $scope.error = "ติดต่อ server ไม่ได้ uppic";
                alert($scope.error);
              });
            };
          };
          //$state.go("app.tab.cropProblem");
        };
        if(redirect == "timeline"){
          $state.go("app.tab.cropTimeline");
        }else{
          $state.go("app.tab.cropProblem");
        }

      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });

    }
  };

})

.controller('AddNoteCtrl',function($scope,$http,$filter,$state,$ionicHistory){

  $scope.note = {detail:'',start_date:new Date(),end_date:new Date()};
  var crop_id = localStorage.getItem('crop_id');
  $scope.doSummit = function(form){
    if(form.$valid) {
      //alert(JSON.stringify($scope.note));
      var start = $filter('date')($scope.note.start_date, 'yyyy-MM-dd HH:mm:ss');
      var end = $filter('date')($scope.note.end_date, 'yyyy-MM-dd');
      //alert(start+"  "+end);
      var data = "crop_id="+crop_id+"&start="+start+"&end="+end+"&data="+$scope.note.detail;
      var ip = ip_server+'/index.php/services/addnote';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //alert(JSON.stringify(data));
        $state.go("app.tab.cropTimeline");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
    }
  };
  $scope.close = function(){
    $state.go("app.tab.cropTimeline");
  }
})

.controller('AddMultimediaCtrl', function($ionicHistory,$scope,$cordovaImagePicker,$cordovaCamera,$http,$filter,$cordovaFileTransfer,$state){

  $scope.images = [];
  $scope.mul = {detail:'',pic:'',date:new Date()};
  $scope.getpiconphone = function(){
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push(results[i]);
          $scope.mul.pic = "ok";
        }
      }, function(error) {
        // error getting photos
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    var image = document.getElementById('myImage');
    $scope.images.push(imageData);
      $scope.mul.pic = "ok";
    }, function(err) {
    // error
    });
  };

  $scope.removeItem = function(index){
    $scope.images.splice(index, 1);
    var len = $scope.images.length;
    if (len == 0){
      $scope.mul.pic = '';
    }
  };

  $scope.close = function(){
    $state.go("app.tab.cropTimeline");
  }
  var crop_id = localStorage.getItem('crop_id');
  $scope.doSummit = function(form){
    if(form.$valid) {
      var date = $filter('date')($scope.mul.date, 'yyyy-MM-dd HH:mm:ss');
      //alert(JSON.stringify($scope.mul));
      var data = "crop_id="+crop_id+"&detail="+$scope.mul.detail+"&date="+date;
      var ip = ip_server+'/index.php/services/addmultimedia';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //alert(JSON.stringify(data));
        var cropm_id = data.data;
        var len = $scope.images.length;
    //    alert("pic : "+len); //undefined
        if (len > 0){
          for(var i = 0; i < len; i++){
        //    alert("name "+i+" : "+$scope.images[i]);
            $scope.date = new Date();
            var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
            $scope.name_pic = 'mul_'+localStorage.getItem('id')+'_'+cropm_id +'_'+i+date+'.jpg';
          //  alert(name_pic);
            var options = {
                    fileKey: "file",
                  //  fileName: "image.jpg",
                    chunkedMode: false,
                    mimeType: "image/jpg",
                    headers:{'headerParam':'headerValue'},
                    httpMethod:"POST",
                    params : {'name_pic':$scope.name_pic},
                };
            var server = ip_server+"/upload/pic/upload_pic.php";
          //  alert(server);
            var filePath = $scope.images[i];
            $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
          //    alert("ok");

            }, function(err) {
                  // Error
                  alert("ERROR : "+JSON.stringify(err));
            }, function (progress) {
                  // constant progress updates
            });
            var data = "cropm_id="+cropm_id +"&name="+$scope.name_pic;
          //  alert(data);
            var ip = ip_server+'/index.php/services/addpicmul';
            $http.post(ip, data, config).success(function (data, status, headers, config) {
              //ok
            //  alert("uppic ok");
            }).error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้ uppic";
              alert($scope.error);
            });
          };
        }//if
        $state.go("app.tab.cropTimeline");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
    }
  };


})

.controller('EditNoteCtrl', function($stateParams,$http,$scope,$filter,$state){
  var id = $stateParams.id;
  var data = "cropn_id="+id;
  var ip = ip_server+'/index.php/services/getcropnote';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    $scope.note = {start_date:new Date(data[0].cropn_start),end_date:new Date(data[0].cropn_end),detail:data[0].cropn_data};
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });
  $scope.close = function(){
    $state.go("app.tab.cropTimeline");
  }
  $scope.doSummit = function(form){
    if(form.$valid) {
      //alert(JSON.stringify($scope.note));
      var start = $filter('date')(new Date($scope.note.start_date).toISOString(), 'yyyy-MM-dd');
      var end = $filter('date')(new Date($scope.note.end_date).toISOString(), 'yyyy-MM-dd');
      var ip = ip_server+'/index.php/services/editnote';
      var data = "cropn_id="+id+"&start="+start+"&end="+end+"&data="+$scope.note.detail;
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //alert("ok");
        $state.go("app.tab.cropTimeline");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
    }
  }
})

.controller('EditMultimediaCtrl', function($stateParams,$http,$scope,$cordovaImagePicker,$cordovaCamera,$state,$cordovaFileTransfer,$filter){
  var id = $stateParams.id;
  //alert(id);
  var ip = ip_server+'/index.php/services/geteditmultimedia';
  var data = "cropm_id="+id;
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    //alert("ok");
    $scope.mul = {detail:data.data[0].cropm_detail,date:new Date(data.data[0].cropm_time)};
    $scope.images = data.pic;
    $scope.mul.pic = "ok";
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });

  $scope.getpiconphone = function(){
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push({src:results[i],id:null});

        }
      }, function(error) {
        // error getting photos
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    var image = document.getElementById('myImage');
    $scope.images.push({src:imageData,id:null});
      $scope.mul.pic = "ok";
    }, function(err) {
    // error
    });
  };

  $scope.removeItem = function(index){
  //  $scope.images.splice(index, 1);

  //  alert(JSON.stringify($scope.images[index].id));
    if($scope.images[index].id == null){
      $scope.images.splice(index, 1);
    }else {
      alert(index + "  "+JSON.stringify($scope.images[index].id));
      var data = "id="+$scope.images[index].id;
      var ip = ip_server+'/index.php/services/delpicmultimedia';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //ok
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });

      $scope.images.splice(index, 1);

    }
    var len = $scope.images.length;
    if (len == 0){
      $scope.mul.pic = "";
    }
  };

  $scope.close = function(){
    $state.go("app.tab.cropTimeline");
  }

  $scope.doSummit = function(form){
    if(form.$valid) {
    //  alert(JSON.stringify($scope.images));
      //alert(JSON.stringify($scope.mul));
      var date = $filter('date')($scope.mul.date, 'yyyy-MM-dd HH:mm:ss');
      var data = "cropm_id="+id+"&detail="+$scope.mul.detail+"&date="+date;
    //  alert(data);
      var ip = ip_server+'/index.php/services/editmultimedia';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
      //  alert(data);
        var cropm_id = data;
        var len = $scope.images.length;
    //    alert(len);
        if (len > 0){
          for(var i = 0; i < len; i++){
            //alert($scope.images[i].id);
            if($scope.images[i].id == null){
              $scope.date = new Date();
              var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
              $scope.name_pic = 'mul_'+localStorage.getItem('id')+'_'+id+'_'+i+date+'.jpg';
              //alert($scope.name_pic);
              var options = {
                      fileKey: "file",
                      chunkedMode: false,
                      mimeType: "image/jpg",
                      headers:{'headerParam':'headerValue'},
                      httpMethod:"POST",
                      params : {'name_pic':$scope.name_pic},
                  };
              var server = ip_server+"/upload/pic/upload_pic.php";
              var filePath = $scope.images[i].src;
              $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
            //    alert("ok");
              }, function(err) {
                    alert("ERROR : "+JSON.stringify(err));
              }, function (progress) {
                    // constant progress updates
              });
              var data = "cropm_id="+id+"&name="+$scope.name_pic;
            //  alert(data);
              var ip = ip_server+'/index.php/services/addpicmul';
              $http.post(ip, data, config).success(function (data, status, headers, config) {
                //ok
              //  alert("uppic ok");
              }).error(function (data, status, header, config) {
                $scope.error = "ติดต่อ server ไม่ได้ uppic";
                alert($scope.error);
              });
            }//if id = null
          }//for
        }//if
        $state.go("app.tab.cropTimeline");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
    }//if from
  }//doSummit

  })

.controller('EditActivitiesCtrl', function($stateParams,$http,$scope,$cordovaCamera,$cordovaImagePicker,$state,$filter,$cordovaFileTransfer){
/*  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  })*/
  var id = $stateParams.id;
  $http.get(ip_server+'/index.php/services/gettypecrop').then(function(res){
    $scope.types = res.data;
  });
  var ip = ip_server+'/index.php/services/getcropdetail';
  var data = "cropd_id="+id+"&crop_id="+localStorage.getItem('crop_id');
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    //alert("ok");
    $scope.atv = {name:data[0].cropd_name,type:data[0].tgui_id,start:new Date(data[0].cropd_start),end:new Date(data[0].cropd_end),datail:data[0].cropd_detail};
    $scope.images = data[0].cropd_pic;
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    alert($scope.error);
  });

  $scope.getpiconphone = function(){
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push({src:results[i],id:null});

        }
      }, function(error) {
        // error getting photos
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    var image = document.getElementById('myImage');
    $scope.images.push({src:imageData,id:null});
      $scope.mul.pic = "ok";
    }, function(err) {
    // error
    });
  };

  $scope.removeItem = function(index){
    if($scope.images[index].id == null){
      $scope.images.splice(index, 1);
    }else {
      //alert(index + "  "+JSON.stringify($scope.images[index].id));
      var data = "id="+$scope.images[index].id;
      var ip = ip_server+'/index.php/services/delpicdetail';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        //ok
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
      $scope.images.splice(index, 1);
    }
  };

  $scope.doSummit = function(form){
    if(form.$valid) {
    //  alert(JSON.stringify($scope.atv));
    //  alert(JSON.stringify($scope.images));
      var start = $filter('date')($scope.atv.start, 'yyyy-MM-dd');
      var end = $filter('date')($scope.atv.end, 'yyyy-MM-dd');
    //  alert(start+"  "+end);
      var crop_id = localStorage.getItem('crop_id');
      var data = "crop_id="+crop_id+"&id="+id+"&name="+$scope.atv.name+"&start="+start+"&end="+end+"&detail="+$scope.atv.datail+"&type="+$scope.atv.type;
    //  alert(data);
      var ip = ip_server+'/index.php/services/editactivity';
      $http.post(ip, data, config).success(function (data, status, headers, config) {

        var len = $scope.images.length;
    //   alert(len);
        if (len > 0){
          for(var i = 0; i < len; i++){
            //alert($scope.images[i].id);
            if($scope.images[i].id == null){
              $scope.date = new Date();
              var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
              $scope.name_pic = 'detail_'+localStorage.getItem('id')+'_'+id+'_'+i+date+'.jpg';
            //  alert($scope.name_pic);
              var options = {
                      fileKey: "file",
                      chunkedMode: false,
                      mimeType: "image/jpg",
                      headers:{'headerParam':'headerValue'},
                      httpMethod:"POST",
                      params : {'name_pic':$scope.name_pic},
                  };
              var server = ip_server+"/upload/pic/upload_pic.php";
              var filePath = $scope.images[i].src;
              $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
            //    alert("ok");
              }, function(err) {
                    alert("ERROR : "+JSON.stringify(err));
              }, function (progress) {
                    // constant progress updates
              });
              var data = "cropd_id="+id+"&name="+$scope.name_pic;
            //  alert("uppic "+data);
              var ip = ip_server+'/index.php/services/addpiccrop';

              $http.post(ip, data, config).success(function (data, status, headers, config) {
                //ok
              //  alert("uppic ok");
              }).error(function (data, status, header, config) {
                $scope.error = "ติดต่อ server ไม่ได้ uppic";
                alert($scope.error);
              });
            }//if id = null
          }//for
        }//if
        $state.go("app.tab.cropTimeline");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });
    }
  };

})

.controller('EditCropCtrl', function($scope,$http,$stateParams,$cordovaGeolocation,$ionicModal,$ionicLoading,$ionicHistory,$state){
  $scope.$on('$ionicView.beforeEnter', function () {
    var crop_id = $stateParams.id;
    var data = "crop_id="+crop_id;
    var ip = ip_server+'/index.php/services/getcropid';
    $http.post(ip, data, config).success(function (data, status, headers, config) {
      $scope.crop = {name:data.data[0]['crop_name'],rai:parseInt(data.data[0]['crop_rai'],10),wa:parseInt(data.data[0]['crop_wa'],10),nan:parseInt(data.data[0]['crop_nan'],10)};
      $scope.lat = data.data[0]['crop_lat'];
      $scope.long = data.data[0]['crop_lat'];
      $http.get(ip_server+'/index.php/services/getnamelatlng/'+data.data[0]['crop_lat']+"/"+data.data[0]['crop_long']).then(function(res){
        $scope.namelatlong = res.data;
      })
      $http.get(ip_server+'/index.php/services/plant').then(function(res){
        $scope.test = res.data;
        angular.forEach($scope.test, function(value, key) {
          if(value['plant_id'] == data.data[0]['plat_id']){
            $scope.plant = res.data[key];
            angular.forEach(res.data[key]['seed'], function(value2, key2) {
              if(value2['seed_id'] == data.data[0]['seed_id']){
                $scope.seed = res.data[key]['seed'][key2];
                angular.forEach(res.data[key]['seed'][key2]['plan'], function(value3, key3) {
                  if(value3['plan_id'] == data.data[0]['pla_id']){
                    $scope.plan = res.data[key]['seed'][key2]['plan'][key3];
                  }
                });////forEach value3
              }
            });//forEach value2
          }
        });//forEach value
      });
    }).error(function (data, status, header, config) {
      $scope.error = "ติดต่อ server ไม่ได้";
      alert($scope.error);
    });

  });

  $scope.changeseed = function(id){
    $scope.seed = {seed_id:id};
  }
  $scope.changeplan = function(id){
    $scope.plan = {plan_id:id};
  }

  $ionicModal.fromTemplateUrl('templates/map.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeMap = function() {
    $scope.modal.hide();
  };
 $scope.map_name = "แก้ไขพื้นที่เพาะปลูก";
  $scope.map = function() {
  //  alert("map");
    $scope.modal.show();
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังค้นหาพิกัดที่คุณอยู่'
    });

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      $scope.lat = position.coords.latitude;
      $scope.long = position.coords.longitude;
      $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
        $scope.namelatlong = res.data;
      });

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "คุณอยู่ที่นี่ !"
      });
      infoWindow.open($scope.map, marker);
      $ionicLoading.hide();
      $scope.click_map = function(){
          google.maps.event.addListenerOnce(map,"click",function(position){
            marker.setMap(null);
            marker = new google.maps.Marker({
              map : map,
              anitmation : google.maps.Animation.DROP,
              position : position.latLng
            });
            map.panTo(position.latLng);
            $scope.lat = position.latLng.lat();
            $scope.long = position.latLng.lng();
            $scope.location = $scope.lat +"  "+$scope.long ;
            $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
              $scope.namelatlong = res.data;
              //alert($scope.namelatlong['full_name']);
            });
          });
        }


    }, function(error){
      console.log("Could not get location");
    //  alert("กรุณาเปิด GPS");
     alert("กรุณาเปิด GPS");
     cordova.plugins.diagnostic.switchToLocationSettings();
     $ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
    });

  };

  $scope.doSummit = function(form){
    if(form.$valid) {
      //alert(JSON.stringify($scope.crop));
    //  alert($scope.lat+" / "+$scope.long);
    //  alert($scope.seed.seed_id+" / "+$scope.plan.plan_id);
      var data = 'id='+$stateParams.id+"&name="+$scope.crop.name+"&seed="+$scope.seed.seed_id+"&plan="+$scope.plan.plan_id+"&rai="+$scope.crop.rai+"&nan="+$scope.crop.nan+"&wa="+$scope.crop.wa+"&lat="+$scope.lat+"&long="+$scope.long;
    //  alert(data)
      var ip = ip_server+'/index.php/services/editcrop';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        $ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
       }).error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
      });
    }
  }

})

.controller('CalendarCtrl', function($ionicSideMenuDelegate,$ionicHistory,$ionicPlatform,$state,$scope,$compile,$http,$ionicPopup,uiCalendarConfig,$cordovaCalendar) {

  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);

//  $scope.$on('$ionicView.enter', function () {
  //  var date = new Date();

    $scope.eventSource1 = {
        url: ip_server+'/index.php/services/getcalender2/'+localStorage.getItem('id'),
     };
    // alert(JSON.stringify($scope.eventSource1));


$scope.eventSources = [$scope.eventSource1];
  $scope.alertOnEventClick = function( date, jsEvent, view){
  //  $scope.alertMessage = (date.title);
    //alert($scope.alertMessage+"  "+date.start+' '+date.end);
    if(date.detail==''){
      var detail= 'ไม่มี';
    }else {
      var detail= date.detail;
    }
    $scope.title = date.title;
    $scope.name = date.name_crop;
    $scope.detail = date.detail;
    $scope.start = date.start;
    $scope.end = date.end;
    //alert($scope.start+" "+$scope.end);

  /*  var alertPopup = $ionicPopup.alert({
     title: '<i class="ion-android-pin" style="font-size: 20px;color:#FF0080;"></i>   <font size="4">'+date.name_crop+'</font></br>',
     template: 'กิจกรรม : '+date.title+'</br> <p>รายละเอียด : '+detail+'</p>',
     okText: 'ตกลง',
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });*/


  var confirmPopup = $ionicPopup.confirm({
    title: '<i class="ion-android-pin" style="font-size: 20px;color:#FF0080;"></i>   <font size="4">'+date.name_crop+'</font></br>',
    template: 'กิจกรรม : '+date.title+'</br> <p>รายละเอียด : '+detail+'</p>',
    cancelText: 'ยกเลิก',
    okText: 'เพิ่มในปฏิทิน'
  });

  confirmPopup.then(function(res) {
    if(res) {
      //alert('ddd '+$scope.title);
      console.log('You are sure');
      console.log($scope.title+" "+$scope.start+" "+$scope.end);
      $cordovaCalendar.createEvent({
      title: $scope.title ,
      location: $scope.name,
      notes: $scope.detail,
      startDate:  new Date($scope.start),
      endDate: new Date($scope.end),
      }).then(function (result) {
        // success
        alert("เพิ่มลงในปฏิทินเรียบร้อยแล้ว");
      }, function (err) {
        // error
        console.log("not createEvent");
        alert(err);
      });
    } else {
      console.log('You are not sure');
    }
  });


  };

  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 500,
      editable: true,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      eventClick: $scope.alertOnEventClick,
      lang: 'th',
    }
  };

   /* event sources array*/


  $scope.class = 'col';
  $scope.check = function(type,$event){
    var classList = $event.target.className.split(/\s+/);
  //  alert(classList[1]);
  console.log(classList[1]);
    if(classList[1] == 'text-gray'){
      console.log('ok');
      //var myEl = angular.element( document.querySelector($event ) );
      $scope.class = 'col';
    }else{
      $scope.class = 'col text-gray';
      console.log('change');
      angular.forEach($scope.eventSource1, function(value, key) {
        //this.push(key + ': ' + value);
        console.log(key + ': ' + value);
        //if($scope.eventSources[key]['type'] == 1){
          //$scope.eventSources.splice(key,1);
          //console.log('del');
          $scope.events.splice(key,1);
        //}
      });
    }
  }

  $scope.addcalendar = function(){
    //alert('ok');
    var url = ip_server+'/index.php/services/getcalender2/'+localStorage.getItem('id');
    $http.get(url).then(function(response) {
      alert(JSON.stringify(response.data))
    })
  /*  $cordovaCalendar.createEvent({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
    }).then(function (result) {
      // success
    }, function (err) {
      // error
    });*/
  }

})

.controller('ProblemCtrl',function($scope,$http,$ionicLoading,$ionicPlatform,$state){
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.$root.showMenuIcon = true;
    $ionicLoading.show({
           template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });

  var data = "";
  var ip = ip_server+'/index.php/services/showproblemall';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         //alert(JSON.stringify(data.data));
         console.log("return " + data.data);
         if(data.status == false){
           $scope.data = "ไม่มีข้อมูล";
         }else{
           $scope.problems = data.data;
         }

         console.log($scope.problems);
        // $scope.total = data.total;
        $ionicLoading.hide();
     })
     .error(function (data, status, header, config) {
         //alert("error: "+JSON.stringify(data) );
         $ionicLoading.hide();
         console.log(" error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
         //$state.go("app.");
     });
    });



     $scope.doRefresh = function() {
       var data = "";
       var ip = ip_server+'/index.php/services/showproblemall';
        $http.post(ip, data, config)
          .success(function (data, status, headers, config) {
              $scope.problems = data.data;
          })
          .error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้";
              alert($scope.error);
          }).finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       })
     };
})

.controller('ProductCtrl', function($ionicPlatform,$scope,$ionicSideMenuDelegate,$state,$http,$cordovaGeolocation,$ionicLoading) {
  $scope.product = [];
//  $scope.count = '';
$scope.count = null;
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.$root.showMenuIcon = true;
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังประมวลผลสินค้า'
    });

    if(localStorage.getItem('lat') == null || localStorage.getItem('long') == null){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
         $scope.lat = position.coords.latitude;
         $scope.long = position.coords.longitude;
         var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=1";
         var ip = ip_server+'/index.php/services/getproduct';
          $http.post(ip, data, config)
            .success(function (data, status, headers, config) {
                $scope.product = data.data;
                //$scope.count = data.count;
                //console.log("count : "+data.count);
                localStorage.setItem('count',data.count);

                angular.forEach($scope.product, function(value, key) {
                  $scope.product[key]['distance'] = parseFloat(value.distance);
                   $scope.product[key]['like'] = parseInt(value.like);
                });
                //alert(JSON.stringify($scope.product));
                $ionicLoading.hide();
            })
            .error(function (data, status, header, config) {
                $scope.error = "ติดต่อ server ไม่ได้";
                $ionicLoading.hide();
                alert($scope.error);
            })

       }, function(err) {
         $ionicLoading.hide();
         alert("กรุณาเปิด GPS");
         cordova.plugins.diagnostic.switchToLocationSettings();
        //$ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
       });
    }else{
      $scope.lat = localStorage.getItem('lat');
      $scope.long = localStorage.getItem('long');
      var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=1";
      var ip = ip_server+'/index.php/services/getproduct';
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
             $scope.product = data.data;
             localStorage.setItem('count',data.count);
             //alert(JSON.stringify($scope.product));
            // console.log($scope.product[0]['distance']);
             angular.forEach($scope.product, function(value, key) {
               $scope.product[key]['distance'] = parseFloat(value.distance);
                $scope.product[key]['like'] = parseInt(value.like);
             });

             $ionicLoading.hide();
         })
         .error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้";
             $ionicLoading.hide();
             alert($scope.error);
         })
    }

 })

  $scope.toggleLeft = function() {
    //$ionicSideMenuDelegate.toggleLeft();
    $ionicSideMenuDelegate.canDragContent(false);
  };

  $scope.doRefresh = function() {
    var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=1";
    var ip = ip_server+'/index.php/services/getproduct';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.product = data.data;
           $scope.count = data.count;
           angular.forEach($scope.product, function(value, key) {
             $scope.product[key]['distance'] = parseFloat(value.distance);
             $scope.product[key]['like'] = parseInt(value.like);
           });
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           $ionicLoading.hide();
           alert($scope.error);
       })
       .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
  $scope.start = 5;
  $scope.loadMore = function() {
    var count = localStorage.getItem('count');

    if($scope.start <= count){

      console.log($scope.start);
      var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=1"+"&row="+count+"&start="+$scope.start;
      $scope.start = $scope.start+5;
      console.log(data);
      var ip = ip_server+'/index.php/services/getproduct';
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
            $scope.product2 = data.data;
             angular.forEach($scope.product2, function(value, key) {
            // var data = { "prd_id":$scope.product2[key]["prd_id"],"name": $scope.product2[key]["name"],"profile": $scope.product2[key]["profile"],"distance": parseFloat($scope.product2[key]["distance"]),"date": $scope.product2[key]["date"],"product":$scope.product2[key]["product"], "pic": {"pprd_id": $scope.product2[key]['pic']["pprd_id"],"pprd_path": $scope.product2a[key]['pic']["pprd_path"],"prd_id": $scope.product2[key]['pic']["prd_id"]},"detail": $scope.product2[key]["detail"],  "price": $scope.product2[key]["price"],"price": $scope.product2[key]["price"],  "location": {"tambon": $scope.product2[key]["location"]["tambon"],"amphoe": $scope.product2[ley]["location"]["amphoe"],"changwat":$scope.product2[key]["location"]["changwat"],"full_name": $scope.product2[key]["location"]["full_name"]},  "like": $scope.product2[key]["like"],  "comment": $scope.product2[key]["comment"]};
             //console.log(data);
              var data = value;
              data.distance = parseFloat(data.distance);
              data.like = parseInt(data.like);
               $scope.product.push(data);
             });

            /* angular.forEach($scope.product, function(value, key) {
               $scope.product.push(data.data);
               $scope.product[key]['distance'] = parseFloat(value.distance);
               $scope.product[key]['like'] = parseInt(value.like);
             });*/
         })
         .error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้";
             $ionicLoading.hide();
             alert($scope.error);
         })
    }


    //console.log('fdfdfd');
    //$scope.data = {name:"test"+i++};
    //$scope.product.push($scope.data);
    $scope.$broadcast('scroll.infiniteScrollComplete');

  };




  $scope.add = function(){
    $state.go("app.addpic");
  }

  $scope.detail = function(id,like,comment){
    //alert(JSON.stringify(data));
    console.log(id);
    console.log(like + comment);
    $state.go("app.detailproduct",{id:id,like:like,comment:comment});
  }
  $scope.gocomment = function(id,iddex){
    $state.go("app.chatproduct",{id:id,comment:$scope.product[iddex].comment,name:$scope.product[iddex].product});
  }

  $scope.like = function(id,index){
    //alert(id+"  "+index);
    var data = "id="+id+"&user="+localStorage.getItem('id');
  //  alert(data);
    var ip = ip_server+'/index.php/services/like';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.status = data;
           if($scope.status == 1){
            // alert('like');
             $scope.product[index]['like'] = parseInt($scope.product[index]['like']) + 1;
           }else{
            // alert('unlike');
             if(parseInt($scope.product[index]['like']) <= 0){
                $scope.product[index]['like'] = 0;
             }else{
               $scope.product[index]['like'] = parseInt($scope.product[index]['like']) - 1;
             }

           }
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
       })
  //  alert($scope.product[index]['like'])
  //  $scope.product[index]['like'] = 1;

  }




})

.controller('AddPicCtrl', function($scope,$state,$cordovaCamera,$cordovaImagePicker,$stateParams) {

  //$scope.images = ['img/Add_Image.png','img/corn.png','img/ionic.png','img/bamboo.png','img/rice_icon.png'];
    //if($stateParams.pic != null){
    //alert($stateParams.img.split(','));
    console.log($stateParams.id);

      if ($stateParams.img == null || $stateParams.img == '') {
      // $scope.images = ['img/Add_Image.png','img/corn.png','img/ionic.png','img/bamboo.png','img/rice_icon.png'];
        $scope.images =[];
          //if($stateParams.pic != null){
      }else {
      //  alert("333");
        console.log($stateParams.img.split(','));
        $scope.images = $stateParams.img.split(',');
      }

  $scope.cont =   5 - $scope.images.length;

  $scope.removeItem = function(index){
    $scope.images.splice(index, 1);
    $scope.cont =   5 - $scope.images.length;
  }

  $scope.getpic = function(){
    var options = {
      maximumImagesCount: $scope.cont,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push(results[i]);
        }
          $scope.cont =   5 - $scope.images.length;
      }, function(error) {
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
     $scope.images.push(imageData);
     $scope.cont =   5 - $scope.images.length;
    }, function(err) {
    // error
    });
  };

  $scope.go = function(){
    //alert("555");
    if($stateParams.id == null || $stateParams.id == '') {
      $state.go('app.addproduct',{pic:$scope.images,crop_id:'no'});
    }else{
      $state.go('app.addproduct',{pic:$scope.images,crop_id:$stateParams.id});
    }

  }

  $scope.close = function(){
    if($stateParams.id != null || $stateParams.id != ''){
      $state.go("app.tab.cropDetail");
    }else{
      $state.go("app.product");
    }

  }

})

.controller('AddPicServiceCtrl', function($scope,$state,$cordovaCamera,$cordovaImagePicker,$stateParams) {

  //$scope.images = ['img/Add_Image.png','img/corn.png','img/ionic.png','img/bamboo.png','img/rice_icon.png'];
    //if($stateParams.pic != null){
    //alert($stateParams.img.split(','));

      if ($stateParams.img == null || $stateParams.img == '') {
      // $scope.images = ['img/Add_Image.png','img/corn.png','img/ionic.png','img/bamboo.png','img/rice_icon.png'];
        $scope.images =[];
          //if($stateParams.pic != null){
      }else {
      //  alert("333");
        console.log($stateParams.img.split(','));
        $scope.images = $stateParams.img.split(',');
      }

  $scope.cont =   5 - $scope.images.length;

  $scope.removeItem = function(index){
    $scope.images.splice(index, 1);
    $scope.cont =   5 - $scope.images.length;
  }

  $scope.getpic = function(){
    var options = {
      maximumImagesCount: $scope.cont,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push(results[i]);
        }
          $scope.cont =   5 - $scope.images.length;
      }, function(error) {
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
     $scope.images.push(imageData);
     $scope.cont =   5 - $scope.images.length;
    }, function(err) {
    // error
    });
  };

  $scope.go = function(){
    //alert("555");
    $state.go('app.addservice',{pic:$scope.images});
  }
  $scope.close = function(){
    $state.go("app.product");
  }

})

.controller('AddProductCtrl', function($scope,$stateParams,$http,$cordovaGeolocation,$ionicLoading,$ionicModal,$state,$filter,$cordovaFileTransfer) {
  //$scope.images = $stateParams.pic;
  console.log($stateParams.crop_id);
  $scope.images = $stateParams.pic.split(',');
    $scope.Tels = [{id: 'tel1'}];
  $scope.product = {name:'',type:1,price:'',unit:'',detail:'',date:new Date(),status:false};
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังค้นหาพิกัด'
    });
  //alert($scope.pic );
  var url = ip_server+'/index.php/services/gettypesell';
  $http.get(url).then(function(response) {
    $scope.type = response.data;
  })

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
     $scope.lat = position.coords.latitude
     $scope.long = position.coords.longitude
     $scope.location = $scope.lat +"  "+$scope.long;
     $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
       $scope.namelatlong = res.data;
       $ionicLoading.hide();
     });

   }, function(err) {
     $ionicLoading.hide();
    alert("กรุณาเปิด GPS");
    cordova.plugins.diagnostic.switchToLocationSettings();
    //$ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
   });
 })

$scope.map_name = "กำหนดพื้นที่";

 $ionicModal.fromTemplateUrl('templates/map.html', {
   scope: $scope
 }).then(function(modal) {
   $scope.modal = modal;
 });

 $scope.closeMap = function() {
   $scope.modal.hide();
 };

 $scope.map = function() {
 //  alert("map");
   $scope.modal.show();
   $ionicLoading.show({
     template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
   });

   var options = {timeout: 10000, enableHighAccuracy: true};

   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
     $scope.lat = position.coords.latitude;
     $scope.long = position.coords.longitude;


     var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

     var mapOptions = {
       center: latLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     var marker = new google.maps.Marker({
         map: map,
         animation: google.maps.Animation.DROP,
         position: latLng
     });

     var infoWindow = new google.maps.InfoWindow({
         content: "คุณอยู่ที่นี่ !"
     });
     infoWindow.open(map, marker);
     $ionicLoading.hide();
     $scope.click_map = function(){
         google.maps.event.addListenerOnce(map,"click",function(position){
           marker.setMap(null);
           marker = new google.maps.Marker({
             map : map,
             anitmation : google.maps.Animation.DROP,
             position : position.latLng
           });
           map.panTo(position.latLng);
           $scope.lat = position.latLng.lat();
           $scope.long = position.latLng.lng();
           $scope.location = $scope.lat +"  "+$scope.long ;
           $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
             $scope.namelatlong = res.data;
           });
         });
       }


   }, function(error){
     console.log("Could not get location");
   //  alert("กรุณาเปิด GPS");
   });

 };

 $scope.close = function(){
   $state.go("app.addpic",{img:$scope.images,id:$stateParams.crop_id});
 }

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

 $scope.doSummit = function(form){
   if(form.$valid) {
    // alert(JSON.stringify($scope.product));
    // alert($scope.lat+'/'+$scope.long);
    var tel = [];
    var datatel = "";
    for (i = 0; i < $scope.Tels.length; i++) {
      //tel.push($scope.Tels[i].data);
      tel[i] =  $scope.Tels[i].data;
      datatel = datatel+"&tel["+i+"]="+tel[i];
    }
    console.log('data crop_id :'+$stateParams.crop_id);
    if($scope.product.status == false){
      if($stateParams.crop_id != 'no' ){
        console.log("crop_id");
        var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+datatel+"&crop_id="+$stateParams.crop_id;
      }else{
          console.log("no crop_id !!");
          var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+datatel;
      }
    }else{
      var expire = $filter('date')($scope.product.date, 'yyyy-MM-dd');
      if($stateParams.crop_id != 'no'){
          var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+"&expire="+expire+datatel+"&crop_id="+$stateParams.crop_id;
      }else {
          var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+"&expire="+expire+datatel;

      }
    }
    console.log(data);
    // alert(data);
     var ip = ip_server+'/index.php/services/addproduct';
     $http.post(ip, data, config).success(function (data, status, headers, config) {
    //  alert(JSON.stringify(data));
       $scope.id_product = data;

       var len = $scope.images.length;
   //    alert("pic : "+len); //undefined
       if (len > 0){
         for(var i = 0; i < len; i++){
        //  alert("name "+i+" : "+$scope.images[i]);
           $scope.date = new Date();
           var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
           $scope.name_pic = 'product_'+localStorage.getItem('id')+'_'+$scope.id_product +'_'+i+date+'.jpg';
        //  alert( $scope.name_pic);
           var options = {
                   fileKey: "file",
                 //  fileName: "image.jpg",
                   chunkedMode: false,
                   mimeType: "image/jpg",
                   headers:{'headerParam':'headerValue'},
                   httpMethod:"POST",
                   params : {'name_pic':$scope.name_pic},
               };
           var server = ip_server+"/upload/product/upload_pic.php";
        //  alert(server);
           var filePath = $scope.images[i];
           $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
            // alert("ok");

           }, function(err) {
                 // Error
                 alert("ERROR : "+JSON.stringify(err));
           }, function (progress) {
                 // constant progress updates
           });
           var data = "prd_id="+ $scope.id_product+"&name="+$scope.name_pic;
         //  alert(data);
           var ip = ip_server+'/index.php/services/addpicproduct';
           $http.post(ip, data, config).success(function (data, status, headers, config) {
             //ok
            // alert("uppic ok");
           }).error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้ uppic";
             alert($scope.error);
           });
         };
       }//if
       if($stateParams.crop_id != 'no' ){
         $state.go("app.tab.cropDetail");
       }else{
         $state.go("app.product");
       }

      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
     });
   }
 };

 $scope.check = function(){
   alert("999");
 }

})

.controller('AddServiceCtrl', function($scope,$stateParams,$http,$cordovaGeolocation,$ionicLoading,$ionicModal,$state,$filter,$cordovaFileTransfer) {
  //$scope.images = $stateParams.pic;
  $scope.images = $stateParams.pic.split(',');
  $scope.Tels = [{id: 'tel1'}];
  $scope.product = {name:'',type:1,price:'',unit:'',detail:'',date:new Date(),status:false};
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังค้นหาพิกัด'
    });
  //alert($scope.pic );
  var url = ip_server+'/index.php/services/gettypesell';
  $http.get(url).then(function(response) {
    $scope.type = response.data;
  })

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
     $scope.lat = position.coords.latitude
     $scope.long = position.coords.longitude
     $scope.location = $scope.lat +"  "+$scope.long;
     $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
       $scope.namelatlong = res.data;
       $ionicLoading.hide();
     });

   }, function(err) {
     $ionicLoading.hide();
    alert("กรุณาเปิด GPS");
    cordova.plugins.diagnostic.switchToLocationSettings();
    //$ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
   });
 })

$scope.map_name = "กำหนดพื้นที่";

 $ionicModal.fromTemplateUrl('templates/map.html', {
   scope: $scope
 }).then(function(modal) {
   $scope.modal = modal;
 });

 $scope.closeMap = function() {
   $scope.modal.hide();
 };

 $scope.map = function() {
 //  alert("map");
   $scope.modal.show();
   $ionicLoading.show({
     template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
   });

   var options = {timeout: 10000, enableHighAccuracy: true};

   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
     $scope.lat = position.coords.latitude;
     $scope.long = position.coords.longitude;


     var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

     var mapOptions = {
       center: latLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     var marker = new google.maps.Marker({
         map: map,
         animation: google.maps.Animation.DROP,
         position: latLng
     });

     var infoWindow = new google.maps.InfoWindow({
         content: "คุณอยู่ที่นี่ !"
     });
     infoWindow.open(map, marker);
     $ionicLoading.hide();
     $scope.click_map = function(){
         google.maps.event.addListenerOnce(map,"click",function(position){
           marker.setMap(null);
           marker = new google.maps.Marker({
             map : map,
             anitmation : google.maps.Animation.DROP,
             position : position.latLng
           });
           map.panTo(position.latLng);
           $scope.lat = position.latLng.lat();
           $scope.long = position.latLng.lng();
           $scope.location = $scope.lat +"  "+$scope.long ;
           $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
             $scope.namelatlong = res.data;
           });
         });
       }


   }, function(error){
     console.log("Could not get location");
   //  alert("กรุณาเปิด GPS");
   });

 };

 $scope.close = function(){
   $state.go("app.addpicservice",{img:$scope.pic});
 }

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

 $scope.doSummit = function(form){
   if(form.$valid) {
    // alert(JSON.stringify($scope.product));
    // alert($scope.lat+'/'+$scope.long);
    var tel = [];
    var datatel = "";
    for (i = 0; i < $scope.Tels.length; i++) {
      //tel.push($scope.Tels[i].data);
      tel[i] =  $scope.Tels[i].data;
      datatel = datatel+"&tel["+i+"]="+tel[i];
    }
  /*  if($scope.product.status == false){
      var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+datatel;
    }else{
      var expire = $filter('date')($scope.product.date, 'yyyy-MM-dd');
      var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type="+$scope.product.type+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+"&expire="+expire+datatel;
    }*/
    var data = "use_id="+localStorage.getItem('id')+"&name="+$scope.product.name+"&type=3"+"&price="+$scope.product.price+"&detail="+$scope.product.detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.unit+datatel;


    // alert(data);
     var ip = ip_server+'/index.php/services/addproduct';
     $http.post(ip, data, config).success(function (data, status, headers, config) {
    //  alert(JSON.stringify(data));
       $scope.id_product = data;

       var len = $scope.images.length;
   //    alert("pic : "+len); //undefined
       if (len > 0){
         for(var i = 0; i < len; i++){
        //  alert("name "+i+" : "+$scope.images[i]);
           $scope.date = new Date();
           var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
           $scope.name_pic = 'product_'+localStorage.getItem('id')+'_'+$scope.id_product +'_'+i+date+'.jpg';
        //  alert( $scope.name_pic);
           var options = {
                   fileKey: "file",
                 //  fileName: "image.jpg",
                   chunkedMode: false,
                   mimeType: "image/jpg",
                   headers:{'headerParam':'headerValue'},
                   httpMethod:"POST",
                   params : {'name_pic':$scope.name_pic},
               };
           var server = ip_server+"/upload/product/upload_pic.php";
        //  alert(server);
           var filePath = $scope.images[i];
           $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
            // alert("ok");

           }, function(err) {
                 // Error
                 alert("ERROR : "+JSON.stringify(err));
           }, function (progress) {
                 // constant progress updates
           });
           var data = "prd_id="+ $scope.id_product+"&name="+$scope.name_pic;
         //  alert(data);
           var ip = ip_server+'/index.php/services/addpicproduct';
           $http.post(ip, data, config).success(function (data, status, headers, config) {
             //ok
            // alert("uppic ok");
           }).error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้ uppic";
             alert($scope.error);
           });
         };
       }//if
       $state.go("app.service");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
     });
   }
 };

})

.controller('ServiceCtrl', function($ionicPlatform,$scope,$ionicSideMenuDelegate,$state,$http,$cordovaGeolocation,$ionicLoading) {
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.$root.showMenuIcon = true;
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังประมวลผลบริการ/รับจ้าง'
    });

  if(localStorage.getItem('lat') == null || localStorage.getItem('long') == null){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
       $scope.lat = position.coords.latitude
       $scope.long = position.coords.longitude
       var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=2";
       var ip = ip_server+'/index.php/services/getproduct';
        $http.post(ip, data, config)
          .success(function (data, status, headers, config) {
              $scope.product = data.data;
              localStorage.setItem('count',data.count);
              //alert(JSON.stringify($scope.product));
              angular.forEach($scope.product, function(value, key) {
                $scope.product[key]['distance'] = parseFloat(value.distance);
                 $scope.product[key]['like'] = parseInt(value.like);
              });
              $ionicLoading.hide();
          })
          .error(function (data, status, header, config) {
              $scope.error = "ติดต่อ server ไม่ได้";
              $ionicLoading.hide();
              alert($scope.error);
          })

     }, function(err) {
       $ionicLoading.hide();
       alert("กรุณาเปิด GPS");
       cordova.plugins.diagnostic.switchToLocationSettings();
      //$ionicHistory.clearCache().then(function(){ $state.go('app.crop') })
     });
  }else{
    console.log("ok gps");
    $scope.lat = localStorage.getItem('lat');
    $scope.long = localStorage.getItem('long');
    var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=2";
    var ip = ip_server+'/index.php/services/getproduct';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.product = data.data;
           localStorage.setItem('count',data.count);
           angular.forEach($scope.product, function(value, key) {
             $scope.product[key]['distance'] = parseFloat(value.distance);
              $scope.product[key]['like'] = parseInt(value.like);
           });
           //alert(JSON.stringify($scope.product));
           $ionicLoading.hide();
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           $ionicLoading.hide();
           alert($scope.error);
       })
  }
 })

  $scope.toggleLeft = function() {
    //$ionicSideMenuDelegate.toggleLeft();
    $ionicSideMenuDelegate.canDragContent(false);
  };

  $scope.doRefresh = function() {
    var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=2";
    var ip = ip_server+'/index.php/services/getproduct';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.product = data.data;
           localStorage.setItem('count',data.count);
           angular.forEach($scope.product, function(value, key) {
             $scope.product[key]['distance'] = parseFloat(value.distance);
              $scope.product[key]['like'] = parseInt(value.like);
           });
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           $ionicLoading.hide();
           alert($scope.error);
       })
       .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.start = 5;
  $scope.loadMore = function() {
    var count = localStorage.getItem('count');

    if($scope.start <= count){

      console.log($scope.start);
      var data = "lat="+$scope.lat+"&long="+$scope.long+"&type=2"+"&row="+count+"&start="+$scope.start;
      $scope.start = $scope.start+5;
      console.log(data);
      var ip = ip_server+'/index.php/services/getproduct';
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
            $scope.product2 = data.data;
             angular.forEach($scope.product2, function(value, key) {
            // var data = { "prd_id":$scope.product2[key]["prd_id"],"name": $scope.product2[key]["name"],"profile": $scope.product2[key]["profile"],"distance": parseFloat($scope.product2[key]["distance"]),"date": $scope.product2[key]["date"],"product":$scope.product2[key]["product"], "pic": {"pprd_id": $scope.product2[key]['pic']["pprd_id"],"pprd_path": $scope.product2a[key]['pic']["pprd_path"],"prd_id": $scope.product2[key]['pic']["prd_id"]},"detail": $scope.product2[key]["detail"],  "price": $scope.product2[key]["price"],"price": $scope.product2[key]["price"],  "location": {"tambon": $scope.product2[key]["location"]["tambon"],"amphoe": $scope.product2[ley]["location"]["amphoe"],"changwat":$scope.product2[key]["location"]["changwat"],"full_name": $scope.product2[key]["location"]["full_name"]},  "like": $scope.product2[key]["like"],  "comment": $scope.product2[key]["comment"]};
             //console.log(data);
              var data = value;
              data.distance = parseFloat(data.distance);
              data.like = parseInt(data.like);
               $scope.product.push(data);
             });

            /* angular.forEach($scope.product, function(value, key) {
               $scope.product.push(data.data);
               $scope.product[key]['distance'] = parseFloat(value.distance);
               $scope.product[key]['like'] = parseInt(value.like);
             });*/
         })
         .error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้";
             $ionicLoading.hide();
             alert($scope.error);
         })
    }


    //console.log('fdfdfd');
    //$scope.data = {name:"test"+i++};
    //$scope.product.push($scope.data);
    $scope.$broadcast('scroll.infiniteScrollComplete');

  };


  $scope.add = function(){
    $state.go("app.addpicservice");
  }

  $scope.detail = function(id,like,comment){
    $state.go("app.detailproduct",{id:id,like:like,comment:comment});
  }

  $scope.gocomment = function(id,iddex){
    $state.go("app.chatproduct",{id:id,comment:$scope.product[iddex].comment,name:$scope.product[iddex].product});
  }

  $scope.like = function(id,index){
    //alert(id+"  "+index);
    var data = "id="+id+"&user="+localStorage.getItem('id');
  //  alert(data);
    var ip = ip_server+'/index.php/services/like';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.status = data;
           if($scope.status == 1){
            // alert('like');
             $scope.product[index]['like'] = parseInt($scope.product[index]['like']) + 1;
           }else{
            // alert('unlike');
             if(parseInt($scope.product[index]['like']) <= 0){
                $scope.product[index]['like'] = 0;
             }else{
               $scope.product[index]['like'] = parseInt($scope.product[index]['like']) - 1;
             }

           }
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
       })
  //  alert($scope.product[index]['like'])
  //  $scope.product[index]['like'] = 1;

  }


})


.controller('SellCtrl', function($ionicPlatform,$scope,$http,$ionicLoading,$ionicPopup,$state) {
  $ionicPlatform.registerBackButtonAction(function (event) {
    $state.go("app.crop");
  }, 100);
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.$root.showMenuIcon = true;
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กำลังโหลดข้อมูล'
    });

    var data = "id="+localStorage.getItem('id');
    var ip = ip_server+'/index.php/services/getsell';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.sell = data.data;
           $ionicLoading.hide();
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           $ionicLoading.hide();
           alert($scope.error);
       })
    })

    $scope.editpic = function(index,type){
      //alert(index+" "+type);
      if(type=='3'){
        //alert("service");
        $state.go("app.editpicservice",{id:index});
      }else{
        //alert("product");
        $state.go("app.editpicproduct",{id:index});
      }
    }

    $scope.edit = function(index,type){
      if(type=='3'){
        //alert("service");
        $state.go("app.editservice",{id:index});
      }else{
        //alert("product");
        $state.go("app.editproduct",{id:index});
      }
    }

    $scope.del = function(id,index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'ยืนยันการลบ',
        template: 'คุณต้องการลบข้อมูลนี้ ?',
        cancelText: 'ยกเลิก',
        okText: 'ตกลง'
      });
      confirmPopup.then(function(res) {
        if(res) {
        //  alert('You are sure'+id)
          var data = "id="+id;
          var ip = ip_server+'/index.php/services/delsell';
          $http.post(ip, data, config).success(function (data, status, headers, config) {
            $scope.sell.splice(index,1);
          }).error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้";
            alert($scope.error);
          })

        } else {
          console.log('You are not sure');
        }
      })
    };

    $scope.doRefresh = function() {
      var data = "id="+localStorage.getItem('id');
      var ip = ip_server+'/index.php/services/getsell';
       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
             $scope.sell = data.data;
             $ionicLoading.hide();
         })
         .error(function (data, status, header, config) {
             $scope.error = "ติดต่อ server ไม่ได้";
             $ionicLoading.hide();
             alert($scope.error);
         })
         .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      })
    };

})

.controller('EditPicProductCtrl', function($scope,$http,$stateParams,$cordovaCamera,$cordovaImagePicker,$state,$cordovaFileTransfer,$filter) {
  var id = $stateParams.id;
  //alert(id);
  $scope.ip = ip_server;
  var url = ip_server+'/index.php/services/getpicproduct/'+id;
  //alert(url);
  $http.get(url).then(function(response) {
    $scope.images = response.data;
      $scope.cont =   5 - $scope.images.length;
  })

  $scope.go = function(){
  //  alert("add pic");
    $scope.id_product = id;

    var len = $scope.images.length;
  //alert(len);
//    alert("pic : "+len); //undefined
    if (len > 0){
      for(var i = 0; i < len; i++){
        if($scope.images[i]['pprd_id'] == ''){
        $scope.date = new Date();
        var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
        $scope.name_pic = 'product_'+localStorage.getItem('id')+'_'+$scope.id_product +'_'+i+date+'.jpg';
      //  alert($scope.name_pic);
        var options = {
                fileKey: "file",
              //  fileName: "image.jpg",
                chunkedMode: false,
                mimeType: "image/jpg",
                headers:{'headerParam':'headerValue'},
                httpMethod:"POST",
                params : {'name_pic':$scope.name_pic},
            };
        var server = ip_server+"/upload/product/upload_pic.php";
     //  alert(server);
        var filePath = $scope.images[i].pprd_path;
        $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
        //  alert("ok");

        }, function(err) {
              // Error
              alert("ERROR : "+JSON.stringify(err));
        }, function (progress) {
              // constant progress updates
        });
        var data = "prd_id="+ $scope.id_product+"&name="+$scope.name_pic;
      //  alert(data);
        var ip = ip_server+'/index.php/services/addpicproduct';
        $http.post(ip, data, config).success(function (data, status, headers, config) {
          //ok
          alert("uppic ok");
        }).error(function (data, status, header, config) {
          $scope.error = "ติดต่อ server ไม่ได้ uppic";
          alert($scope.error);
        });
        }
      };//for
    }//if
    $state.go("app.sell");
  }

  $scope.close = function(){
    $state.go("app.sell");
  }

  $scope.removeItem = function(index){
    //$scope.images.splice(index, 1);

    if($scope.images[index].id == ''){
      $scope.images.splice(index, 1);
      $scope.cont =   5 - $scope.images.length;
    }else {
      var data = "pprd_id="+$scope.images[index].pprd_id;
      var ip = ip_server+'/index.php/services/delpicproduct';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        $scope.images.splice(index, 1);
        $scope.cont =   5 - $scope.images.length;
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });

    }
  }

  $scope.getpic = function(){
    var options = {
      maximumImagesCount: $scope.cont,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.images.push({pprd_path:results[i],pprd_id:''});
        }
          $scope.cont =   5 - $scope.images.length;
      }, function(error) {
      });
  };

  $scope.takepic = function(){
    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true,
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
     //$scope.images.push(imageData);
     $scope.images.push({pprd_path:imageData,pprd_id:''});
     $scope.cont =   5 - $scope.images.length;
    }, function(err) {
    // error
    });
  };


})

.controller('EditPicServiceCtrl', function($stateParams,$scope,$http,$cordovaCamera,$cordovaImagePicker,$state,$cordovaFileTransfer,$filter){
    var id = $stateParams.id;

    $scope.ip = ip_server;
    var url = ip_server+'/index.php/services/getpicproduct/'+id;
    //alert(url);
    $http.get(url).then(function(response) {
      $scope.images = response.data;
      $scope.cont =   5 - $scope.images.length;
    })

    $scope.go = function(){
      //alert("add pic");
      $scope.id_product = id;

      var len = $scope.images.length;
  //    alert("pic : "+len); //undefined
      if (len > 0){
        for(var i = 0; i < len; i++){
          if($scope.images[i]['pprd_id'] == ''){
          $scope.date = new Date();
          var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
          $scope.name_pic = 'product_'+localStorage.getItem('id')+'_'+$scope.id_product +'_'+i+date+'.jpg';
          var options = {
                  fileKey: "file",
                //  fileName: "image.jpg",
                  chunkedMode: false,
                  mimeType: "image/jpg",
                  headers:{'headerParam':'headerValue'},
                  httpMethod:"POST",
                  params : {'name_pic':$scope.name_pic},
              };
          var server = ip_server+"/upload/product/upload_pic.php";
       //  alert(server);
          var filePath = $scope.images[i].pprd_path;
          $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {
           // alert("ok");
          }, function(err) {
                // Error
                alert("ERROR : "+JSON.stringify(err));
          }, function (progress) {
                // constant progress updates
          });
          var data = "prd_id="+ $scope.id_product+"&name="+$scope.name_pic;
        //  alert(data);
          var ip = ip_server+'/index.php/services/addpicproduct';
          $http.post(ip, data, config).success(function (data, status, headers, config) {
            //ok
           // alert("uppic ok");
          }).error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้ uppic";
            alert($scope.error);
          });
          }
        };//for
      }//if
    }

    $scope.close = function(){
      $state.go("app.sell");
    }

    $scope.removeItem = function(index){
      //$scope.images.splice(index, 1);
      if($scope.images[index].id == ''){
        $scope.images.splice(index, 1);
        $scope.cont =   5 - $scope.images.length;
      }else {
        var data = "pprd_id="+$scope.images[index].pprd_id;
        var ip = ip_server+'/index.php/services/delpicproduct';
        $http.post(ip, data, config).success(function (data, status, headers, config) {
          $scope.images.splice(index, 1);
          $scope.cont =   5 - $scope.images.length;
        }).error(function (data, status, header, config) {
          $scope.error = "ติดต่อ server ไม่ได้";
          alert($scope.error);
        });
      }
    }

    $scope.getpic = function(){
      var options = {
        maximumImagesCount: $scope.cont,
        quality: 30
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            $scope.images.push({pprd_path:results[i],pprd_id:''});
          }
            $scope.cont =   5 - $scope.images.length;
        }, function(error) {
        });
    };

    $scope.takepic = function(){
      var options = {
          quality: 30,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation:true,
          };

      $cordovaCamera.getPicture(options).then(function(imageData) {
       //$scope.images.push(imageData);
       $scope.images.push({pprd_path:imageData,pprd_id:''});
       $scope.cont =   5 - $scope.images.length;
      }, function(err) {
      // error
      });
    };
})

.controller('EditProductCtrl', function($scope,$http,$stateParams,$filter,$ionicLoading,$cordovaGeolocation,$ionicModal,$state) {
//  $scope.Tels = [{id: 'tel1',data:'0842050940'},{id: 'tel2',data:'0842050940'}];
  //$scope.product = {name:'',type:1,price:'',unit:'',detail:'',date:new Date(),status:false};
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });
  var id = $stateParams.id;
  $scope.id = id;
  $scope.date = new Date();
  var data = "id="+id;
  var ip = ip_server+'/index.php/services/getdataproduct';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    if(data.data[0]['prd_expire'] == null){
      var status = false;
      var prd_expire = new Date();
      console.log(prd_expire);
    }else{
      var status = true;
      var prd_expire = new Date(data.data[0]['prd_expire']);
      console.log(prd_expire);
    }
    $scope.product = {prd_name:data.data[0]['prd_name'],tsell_id:data.data[0]['tsell_id'],prd_price:parseInt(data.data[0].prd_price, 10),prd_unit:data.data[0]['prd_unit'],prd_detail:data.data[0]['prd_detail'],prd_expire:prd_expire,status:status};
    //$scope.product = data.data[0];
    //$scope.price = parseInt(data.data[0].prd_price, 10);

    $scope.Tels = data.tel;
    $scope.lat = data.data[0]['prd_lat'];
    $scope.long = data.data[0]['prd_long'];
    $http.get(ip_server+'/index.php/services/getnamelatlng/'+data.data[0]['prd_lat']+"/"+data.data[0]['prd_long']).then(function(res){
      $scope.namelatlong = res.data;
    })

    $ionicLoading.hide();
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    $ionicLoading.hide();
    alert($scope.error);
  });

  var url = ip_server+'/index.php/services/gettypesell';
  $http.get(url).then(function(response) {
    $scope.type = response.data;
  })
});

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

  $scope.map_name = "กำหนดพื้นที่";

   $ionicModal.fromTemplateUrl('templates/map.html', {
     scope: $scope
   }).then(function(modal) {
     $scope.modal = modal;
   });

   $scope.closeMap = function() {
     $scope.modal.hide();
   };

   $scope.map = function() {
   //  alert("map");
     $scope.modal.show();
     $ionicLoading.show({
       template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
     });

     var options = {timeout: 10000, enableHighAccuracy: true};

     $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       $scope.lat = position.coords.latitude;
       $scope.long = position.coords.longitude;


       var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

       var mapOptions = {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       var marker = new google.maps.Marker({
           map: map,
           animation: google.maps.Animation.DROP,
           position: latLng
       });

       var infoWindow = new google.maps.InfoWindow({
           content: "คุณอยู่ที่นี่ !"
       });
       infoWindow.open(map, marker);
       $ionicLoading.hide();
       $scope.click_map = function(){
           google.maps.event.addListenerOnce(map,"click",function(position){
             marker.setMap(null);
             marker = new google.maps.Marker({
               map : map,
               anitmation : google.maps.Animation.DROP,
               position : position.latLng
             });
             map.panTo(position.latLng);
             $scope.lat = position.latLng.lat();
             $scope.long = position.latLng.lng();
             $scope.location = $scope.lat +"  "+$scope.long ;
             $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
               $scope.namelatlong = res.data;
             });
           });
         }


     }, function(error){
       console.log("Could not get location");
     //  alert("กรุณาเปิด GPS");
     });

   };

   $scope.doSummit = function(form){
     if(form.$valid) {
       //alert("444");
       //alert(JSON.stringify($scope.product));
       var tel = [];
       var datatel = "";
       for (i = 0; i < $scope.Tels.length; i++) {
         tel[i] =  $scope.Tels[i].pdc_data;
         datatel = datatel+"&tel["+i+"]="+tel[i];
       }
    // alert($scope.status.data);
       if($scope.product.status == false ){
         var data = "id="+$scope.id+"&name="+$scope.product.prd_name+"&type="+$scope.product.tsell_id+"&price="+$scope.product.prd_price+"&detail="+$scope.product.prd_detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.prd_unit+datatel;
         console.log(data);
       }else{
         var expire = $filter('date')($scope.product.prd_expire, 'yyyy-MM-dd');
         var data = "id="+$scope.id+"&name="+$scope.product.prd_name+"&type="+$scope.product.tsell_id+"&price="+$scope.product.prd_price+"&detail="+$scope.product.prd_detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.prd_unit+"&expire="+expire+datatel;
         console.log(expire);
         console.log(data);
       }

        var ip = ip_server+'/index.php/services/updateproduct';
        $http.post(ip, data, config).success(function (data, status, headers, config) {
          //alert("update ok");
          $state.go("app.sell");
         }).error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
        });
     }//if
   }

})

.controller('EditServicCtrl', function($scope,$http,$stateParams,$filter,$ionicLoading,$cordovaGeolocation,$ionicModal,$state) {
//  $scope.Tels = [{id: 'tel1',data:'0842050940'},{id: 'tel2',data:'0842050940'}];
  //$scope.product = {name:'',type:1,price:'',unit:'',detail:'',date:new Date(),status:false};
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });
  var id = $stateParams.id;
  $scope.id = id;
  var data = "id="+id;
  var ip = ip_server+'/index.php/services/getdataproduct';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
//$scope.product = data.data[0];
    $scope.product = {prd_name:data.data[0]['prd_name'],tsell_id:data.data[0]['tsell_id'],prd_price:parseInt(data.data[0].prd_price, 10),prd_unit:data.data[0]['prd_unit'],prd_detail:data.data[0]['prd_detail'],status:status};
  //  $scope.price = parseInt(data.data[0].prd_price, 10);
    $scope.Tels = data.tel;
    $scope.lat = data.data[0]['prd_lat'];
    $scope.long = data.data[0]['prd_long'];
    console.log($scope.lat+' '+$scope.long);
    $http.get(ip_server+'/index.php/services/getnamelatlng/'+data.data[0]['prd_lat']+"/"+data.data[0]['prd_long']).then(function(res){
      $scope.namelatlong = res.data;
      console.log($scope.namelatlong);
    })

    $ionicLoading.hide();
  }).error(function (data, status, header, config) {
    $scope.error = "ติดต่อ server ไม่ได้";
    $ionicLoading.hide();
    alert($scope.error);
  });

  var url = ip_server+'/index.php/services/gettypesell';
  $http.get(url).then(function(response) {
    $scope.type = response.data;
  })
});

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

  $scope.map_name = "กำหนดพื้นที่";

   $ionicModal.fromTemplateUrl('templates/map.html', {
     scope: $scope
   }).then(function(modal) {
     $scope.modal = modal;
   });

   $scope.closeMap = function() {
     $scope.modal.hide();
   };

   $scope.map = function() {
   //  alert("map");
     $scope.modal.show();
     $ionicLoading.show({
       template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
     });

     var options = {timeout: 10000, enableHighAccuracy: true};

     $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       $scope.lat = position.coords.latitude;
       $scope.long = position.coords.longitude;


       var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

       var mapOptions = {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       var marker = new google.maps.Marker({
           map: map,
           animation: google.maps.Animation.DROP,
           position: latLng
       });

       var infoWindow = new google.maps.InfoWindow({
           content: "คุณอยู่ที่นี่ !"
       });
       infoWindow.open(map, marker);
       $ionicLoading.hide();
       $scope.click_map = function(){
           google.maps.event.addListenerOnce(map,"click",function(position){
             marker.setMap(null);
             marker = new google.maps.Marker({
               map : map,
               anitmation : google.maps.Animation.DROP,
               position : position.latLng
             });
             map.panTo(position.latLng);
             $scope.lat = position.latLng.lat();
             $scope.long = position.latLng.lng();
             $scope.location = $scope.lat +"  "+$scope.long ;
             $http.get(ip_server+'/index.php/services/getnamelatlng/'+$scope.lat+"/"+$scope.long).then(function(res){
               $scope.namelatlong = res.data;
             });
           });
         }


     }, function(error){
       console.log("Could not get location");
     //  alert("กรุณาเปิด GPS");
     });

   };

   $scope.doSummit = function(form){
     if(form.$valid) {
       //alert("444");
       //alert(JSON.stringify($scope.product));
       var tel = [];
       var datatel = "";
       for (i = 0; i < $scope.Tels.length; i++) {
         tel[i] =  $scope.Tels[i].pdc_data;
         datatel = datatel+"&tel["+i+"]="+tel[i];
       }
        //alert($scope.price);
        var data = "id="+$scope.id+"&name="+$scope.product.prd_name+"&type="+$scope.product.tsell_id+"&price="+$scope.product.prd_price+"&detail="+$scope.product.prd_detail+"&lat="+$scope.lat+"&long="+$scope.long+"&unit="+$scope.product.prd_unit+datatel;
        //alert(data);
        console.log(data);
        var ip = ip_server+'/index.php/services/updateproduct';
        $http.post(ip, data, config).success(function (data, status, headers, config) {
          //alert("update ok");
          $state.go("app.sell");
         }).error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
        });

     }//if
   }

})

.controller('DetailProductCtrl', function($scope,$stateParams,$http,$state,$ionicPlatform){
  //$scope.items = [{src:"img/ionic.png"},{src:"img/ionic.png"}];
  $ionicPlatform.registerBackButtonAction(function () {
      navigator.app.backHistory();
  }, 100);

  var id = $stateParams.id;

//  console.log($scope.data);
  var data = "id="+id;

  var ip = ip_server+'/index.php/services/getdataproduct';
  $http.post(ip, data, config).success(function (data, status, headers, config) {
    //  alert(JSON.stringify(data.data));
      $scope.detail = data.data[0];
      $scope.tel = data.tel;
      $scope.items = data.pic;
      $scope.like = $stateParams.like;
      $scope.comment = $stateParams.comment;
      $scope.expire = data.expire;
      console.log($scope.like+"  "+$scope.comment);
    //$state.go("app.sell");
   }).error(function (data, status, header, config) {
     $scope.error = "ติดต่อ server ไม่ได้";
     alert($scope.error);
  });

  $scope.likena = function(){
    //alert(id);
   var data = "id="+id+"&user="+localStorage.getItem('id');
    var ip = ip_server+'/index.php/services/like';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.status = data;
           if($scope.status == 1){
            // alert('like');
              $scope.like = parseInt($scope.like) + 1;
           }else{
            // alert('unlike');
             if(parseInt($scope.like) <= 0){
                $scope.like = 0;
             }else{
               $scope.like = parseInt($scope.like) - 1;
             }

           }
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
       })
  }
  $scope.gocomment = function(){
    $state.go("app.chatproduct",{id:id,comment:$scope.comment,name:$scope.detail.prd_name});
  }
})

.controller('ChatProductCtrl', function($scope,$stateParams,$http,$ionicPlatform){
  $ionicPlatform.registerBackButtonAction(function () {
      navigator.app.backHistory();
  }, 100);
  $scope.count = $stateParams.comment;
  $scope.name = $stateParams.name;
  $scope.ip_pic = ip_server+"/";
  var id = $stateParams.id;
  //alert(id);
  $scope.text = "";
  $scope.id_user = localStorage.getItem('id');
  var data = "id="+id;
   var ip = ip_server+'/index.php/services/getcommentproduct';
   $http.post(ip, data, config).success(function (data, status, headers, config) {
     $scope.chats = data.data;
   }).error(function (data, status, header, config) {
     $scope.error = "ติดต่อ server ไม่ได้";
     alert($scope.error);
   });

  $scope.send = function(){
  //  alert($scope.text);
    var data = "id="+id+"&data="+$scope.text+"&user="+localStorage.getItem('id');
    //alert(data);
    var ip = ip_server+'/index.php/services/addcommentproduct';
    $http.post(ip, data, config).success(function (data, status, headers, config) {
      $scope.chats = data.data;
      $scope.count = data.count;
    }).error(function (data, status, header, config) {
      $scope.error = "ติดต่อ server ไม่ได้";
      alert($scope.error);
    });
    $scope.text = "";
  }

  $scope.doRefresh = function() {
     var data = "id="+id;
     //alert(data);
     var ip = ip_server+'/index.php/services/getcommentproduct';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
         $scope.chats = data.data;
         //$scope.count = data.count;
       })
       .error(function (data, status, header, config) {
           $scope.error = "ติดต่อ server ไม่ได้";
           alert($scope.error);
       })
       .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

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

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.loaded', function(e) {
    $scope.name = localStorage.getItem('name');
    var path = localStorage.getItem('pic');
    $scope.pic = ip_server+path;
  });

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
  if(check === true || check === "true"){
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
                    quality: 30,
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
                    quality: 30,
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

.controller('CropCtrl',function($scope, $http, $state, $ionicViewService,$ionicHistory,$ionicPopup){
  //refresh
  $scope.$on("$ionicView.enter", function () {
   $ionicHistory.clearCache();
   //$ionicHistory.clearHistory();
  });
  $scope.doRefresh = function() {
    var data = "use_id="+localStorage.getItem('id');
    var ip = ip_server+'/index.php/services/getcrop';
     $http.post(ip, data, config)
       .success(function (data, status, headers, config) {
           $scope.api = data.data;
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

  $ionicViewService.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });



  var data = "use_id="+localStorage.getItem('id');
  //console.log(data);
  var ip = ip_server+'/index.php/services/getcrop';
  $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         $scope.api = data.data;
     })
     .error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
     });


  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.add = function(){
    console.log("add crop fn");
    $state.go("app.addCrop");
  }
  $scope.edit = function(id) {
    alert(id);
  }
  $scope.del = function(id) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'ยืนยันการลบ',
      template: 'คุณต้องการลบข้อมูลนี้ ?'
    });
    confirmPopup.then(function(res) {
      if(res) {
      alert('You are sure')

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
 /*  localStorage.setItem('name',"");
   localStorage.setItem('login',"");
   localStorage.setItem('pic',"");
   localStorage.setItem('id',"");*/
   $state.go("login");
})

.controller('AddCropCtrl',function($state,$ionicModal,$scope,$cordovaGeolocation,$http){
  console.log('add crop');
  $scope.crop = { name: '', seed: '', plan:'',rai:'',nan:'',wa:'',plant:''};
  $scope.seeds = [];
  //$scope.plans = [];
  //$scope.location = [];
  $scope.doSummit = function(form){
    alert("ok"+localStorage.getItem('id'));

      $scope.user = localStorage.getItem('id');
      var data = "name="+$scope.crop.name+"&id_user="+$scope.user+"&seed="+$scope.crop.seed+"&plan="+$scope.crop.plan+"&rai="+$scope.crop.rai+"&nan="+$scope.crop.nan+"&wa="+$scope.crop.wa+"&lat="+$scope.lat+"&long="+$scope.long;
      alert(data);
      var ip = ip_server+'/index.php/services/addcrop';
      $http.post(ip, data, config).success(function (data, status, headers, config) {
        alert("save");
        $state.go("app.crop");
       }).error(function (data, status, header, config) {
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
      });

  };

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
      $scope.lat = position.coords.latitude;
      $scope.long = position.coords.longitude;

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
            $scope.location = $scope.lat +"  "+$scope.long ;
          });
        }

    }, function(error){
      console.log("Could not get location");
    //  alert("กรุณาเปิด GPS");
    });
    $scope.modal.show();
  };

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

 $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
     $scope.lat = position.coords.latitude
     $scope.long = position.coords.longitude
     $scope.location = $scope.lat +"  "+$scope.long;
   }, function(err) {
    //  alert("กรุณาเปิด GPS");
   });


})

.controller('GetIdCropCtrl',function($state,$stateParams){
  var id = $stateParams.id;
  alert(id);
  localStorage.removeItem('crop_id');
  localStorage.setItem('crop_id',id);
  $state.go("app.tab.cropTimeline", {}, { reload: true });
})

.controller('CropDetailCtrl',function($scope,$http,$state,$ionicLoading){
  console.log('Detail');
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
           template: '<ion-spinner icon="android"></ion-spinner> กรุณารอสักครู่'
    });

  $scope.crop_id = localStorage.getItem('crop_id');
  var data = "crop_id="+$scope.crop_id;
  //console.log(data);
  var ip = ip_server+'/index.php/services/showcrop';
   $http.post(ip, data, config)
     .success(function (data, status, headers, config) {
         //alert(JSON.stringify(data.data));
         $ionicLoading.hide();
         $scope.crop= data.data;
     })
     .error(function (data, status, header, config) {
         //alert("error: "+JSON.stringify(data) );
         $ionicLoading.hide();
         console.log("login error");
         $scope.error = "ติดต่อ server ไม่ได้";
         alert($scope.error);
         //$state.go("app.login");
     })
    });
})

.controller('CropTimelineCtrl',function($scope,$state,$http,$ionicActionSheet,$cordovaImagePicker,$filter,$cordovaFileTransfer,$ionicLoading){
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


   $scope.showDetail = function(id,data,status,i) {
     //alert(status);
     if (status === 'false' || status === false){
       $scope.botton = [{ text: '<center><div>แสดงข้อมูล</div></center>' },
      { text: '<center><i class="ion-ios-compose">  แก้ไข</i></center>' },
      { text: '<center><i class="ion-trash-a"> ลบ</i></center>' },];
     }else{
       $scope.botton = [{ text: '<center><div>ซ่อนข้อมูล</div></center>' },
      { text: '<center><i class="ion-ios-compose">  แก้ไข</i></center>' },
      { text: '<center><i class="ion-trash-a"> ลบ</i></center>' },];
     }
     $ionicActionSheet.show({
       //titleText: 'การนำเข้ารูป',

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
                alert(id+" "+data);
               break;
             case 2:
                alert(id+" "+data);
               break;
           }
         console.log('BUTTON CLICKED', index);
         return true;
       },
     });
   };
   $scope.event = function(index,status,id,topic){
     //ssalert(index+"  "+$scope.timeline[index].title);
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
            //alert($scope.error);
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
    //alert("ok : "+id);
    var options = {
      maximumImagesCount: 10,
      quality: 30
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          //$scope.images.push(results[i]);
          $scope.timeline[index].pic.push({src:results[i]});
          $scope.date = new Date();
          var date = $filter('date')($scope.date, 'yyyyMMdd_HHmmss');
          $scope.name_pic = 'detail_'+localStorage.getItem('id')+'_'+id +'_'+i+date+'.jpg';
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
        //  alert(server);
          var filePath = results[i];
          $cordovaFileTransfer.upload(encodeURI(server), filePath, options).then(function(result) {

          }, function(err) {
                // Error
                alert("ERROR : "+JSON.stringify(err));
          }, function (progress) {
                // constant progress updates
          });
          var data = "cropd_id="+id +"&name="+$scope.name_pic;
        //  alert(data);
          var ip = ip_server+'/index.php/services/addpiccrop';
          $http.post(ip, data, config).success(function (data, status, headers, config) {
            //ok
          //  alert("uppic ok");
          }).error(function (data, status, header, config) {
            $scope.error = "ติดต่อ server ไม่ได้ uppic";
            alert($scope.error);
          });
        }
      }, function(error) {
        // error getting photos
      });
  }


})

.controller('CropAccountCtrl',function($scope,$http,$state,$ionicHistory,$ionicPopup,$ionicLoading){
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
         //alert(JSON.stringify(data.data));
         $scope.accaccounts = data.data.all;
         $scope.total = data.data.total;
         $ionicLoading.hide();
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
        template: 'คุณต้องการลบข้อมูลนี้ ?'
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

.controller('CropProblemCtrl',function($scope,$http,$state,$ionicHistory,$ionicPopup,$ionicLoading){
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
         $scope.problems = data.data;
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
         template: 'คุณต้องการลบปัญหานี้ ?'
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
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  })
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
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  })
  $scope.id = $stateParams.data;
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
           $state.go("app.tab.cropAccount",{reload:true});
       }).error(function (data, status, header, config) {
          $scope.error = "ติดต่อ server ไม่ได้";
          alert($scope.error);
      });
    }
  };

})

.controller('AddActivitiesCtrl',function($scope, $state){
   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };
 })

 .controller('AddProblemCtrl',function($scope, $state, $ionicActionSheet, $cordovaCamera, $http, $cordovaImagePicker,$ionicHistory,$cordovaFileTransfer,$filter){
   $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
     viewData.enableBack = true;
   })
   $scope.$on("$ionicView.enter", function () {
    $ionicHistory.clearCache();
    //$ionicHistory.clearHistory();
   });
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

 .controller('DetailProblemCtrl',function($scope,$stateParams,$http){
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  })
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
    alert($scope.text);
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

.controller('EditProblemCtrl', function($stateParams,$scope,$http,$cordovaImagePicker,$state,$cordovaFileTransfer,$filter){
  //$scope.problems = [{name:''}];
  $scope.cropp_id = $stateParams.cropp_id;
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
          $state.go("app.tab.cropProblem");
      }).error(function (data, status, header, config) {
        $scope.error = "ติดต่อ server ไม่ได้";
        alert($scope.error);
      });

    }
  };

})

.controller('AddNoteCtrl',function($scope,$http,$filter,$state){
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

.controller('AddMultimediaCtrl', function($scope,$cordovaImagePicker,$cordovaCamera,$http,$filter,$cordovaFileTransfer,$state){
  $scope.images = [];
  $scope.mul = {detail:'',pic:''};
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
      //alert(JSON.stringify($scope.mul));
      var data = "crop_id="+crop_id+"&detail="+$scope.mul.detail;
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

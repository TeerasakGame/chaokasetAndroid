// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordovaOauth','ngCordova','ngMessages','MyApp.Directives','ng-mfb','ion-gallery','ui.calendar','MyApp.Directives2','MyApp.noSpecialChar','MyApp.number'])

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    var check = localStorage.getItem('login');
    if(check === true || check === "true"){
      $state.go("app.crop");
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    cache: false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('register', {
      cache: false,
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
  })

  .state('app.crop', {
    url: '/crop',
    views: {
      'menuContent': {
        templateUrl: 'templates/crop.html',
        controller: 'CropCtrl'
      }
    }
  })

  .state('logout',{
      url: '/logout',
      controller: 'LogoutCtrl'
  })

  .state('getidcrop',{
      url: '/getidcrop/:id',
      controller: 'GetIdCropCtrl'
  })

  .state('app.addCrop', {
      cache: false,
      url: '/addcrop',
      views: {
        'menuContent': {
          templateUrl: 'templates/addcrop.html',
          controller: 'AddCropCtrl'
        }
      }
    })

  .state('app.tab.cropDetail', {
    url: '/cropdetail',
    views: {
      'tab-detail': {
        templateUrl: 'templates/cropdetail.html',
        controller: 'CropDetailCtrl'
      }
    }
  })

  .state('app.tab.cropTimeline', {
    cache: false,
    url: '/croptimeline',
    views: {
      'tab-timeline': {
        templateUrl: 'templates/croptimeline.html',
        controller: 'CropTimelineCtrl'
      }
    }
  })

  .state('app.tab.cropAccount', {
    url: '/cropaccount',
    views: {
      'tab-account': {
        templateUrl: 'templates/cropaccount.html',
        controller: 'CropAccountCtrl'
      }
    }
  })

  .state('app.tab.cropProblem', {
    url: '/cropproblem',
    views: {
      'tab-problem': {
        templateUrl: 'templates/cropproblem.html',
        controller: 'CropProblemCtrl'
      }
    }
  })

  .state('app.tab', {
    url: '/menucropdetail',
    views: {
      'menuContent': {
        templateUrl: 'templates/menucropdetail.html',
      }
    }
  })

  .state('app.addAccount', {
    cache: false,
    url: '/addaccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/addaccount.html',
        controller: 'AddAccountCtrl'
      }
    }
  })
  .state('app.editAccount', {
    url: '/editaccount/:data/:redirect',
    views: {
      'menuContent': {
        templateUrl: 'templates/editaccount.html',
        controller: 'EditAccountCtrl'
      }
    }
  })
  .state('app.addActivities', {
  cache: false,
   url: '/addactivities',
   views: {
     'menuContent': {
       templateUrl: 'templates/addactivities.html',
       controller: 'AddActivitiesCtrl'
     }
   }
 })

 .state('app.editActivities', {
  url: '/editactivities/:id',
  views: {
    'menuContent': {
      templateUrl: 'templates/editactivities.html',
      controller: 'EditActivitiesCtrl'
    }
  }
 })

 .state('app.addProblem', {
   cache: false,
    url: '/addproblem',
    views: {
      'menuContent': {
        templateUrl: 'templates/addproblem.html',
        controller: 'AddProblemCtrl'
      }
    }
  })

  .state('app.detailProblem',{
    url: '/detailproblem/:cropp_id',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailproblem.html',
        controller: 'DetailProblemCtrl'
      }
    }
  })

  .state('app.editProblem', {
     url: '/editproblem/:cropp_id/:redirect',
     views: {
       'menuContent': {
         templateUrl: 'templates/editproblem.html',
         controller: 'EditProblemCtrl'
       }
     }
   })

   .state('app.addnote', {
     cache: false,
     url: '/addnote',
     views: {
       'menuContent': {
         templateUrl: 'templates/addnote.html',
         controller: 'AddNoteCtrl'
       }
     }
   })

   .state('app.editnote', {
      url: '/editnote/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/editnote.html',
          controller: 'EditNoteCtrl'
        }
      }
    })

   .state('app.addmultimedia', {
     cache: false,
     url: '/addmultimedia',
     views: {
       'menuContent': {
         templateUrl: 'templates/addmultimedia.html',
         controller: 'AddMultimediaCtrl'
       }
     }
   })

   .state('app.editmultimedia', {
      url: '/editmultimedia/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/editmultimedia.html',
          controller: 'EditMultimediaCtrl'
        }
      }
    })

    .state('app.editcrop', {
       url: '/editcrop/:id',
       views: {
         'menuContent': {
           templateUrl: 'templates/editcrop.html',
           controller: 'EditCropCtrl'
         }
       }
     })

    .state('app.calendar', {
       cache: false,
       url: '/calendar',
       views: {
         'menuContent': {
           templateUrl: 'templates/calendar.html',
           controller: 'CalendarCtrl'
         }
       }
     })

  .state('app.detailcalender', {
    url: '/detailcalender/:id',
    views: {
     'menuContent': {
       templateUrl: 'templates/calendardetail.html'
     }
    }
  })

  .state('app.product', {
    cache: false,
    url: '/product',
    views: {
     'menuContent': {
       templateUrl: 'templates/product.html',
       controller: 'ProductCtrl'
     }
    }
  })

  .state('app.service', {
    cache: false,
    url: '/service',
    views: {
     'menuContent': {
       templateUrl: 'templates/service.html',
       controller: 'ServiceCtrl'
     }
    }
  })

  .state('app.addpic', {
    cache: false,
    url: '/addpic/:img/:id',
    views: {
     'menuContent': {
       templateUrl: 'templates/addpic.html',
       controller: 'AddPicCtrl'
     }
    }
  })

  .state('app.addpicservice', {
    cache: false,
    url: '/addpicservice/:img',
    views: {
     'menuContent': {
       templateUrl: 'templates/addpic_service.html',
       controller: 'AddPicServiceCtrl'
     }
    }
  })

  .state('app.editpicservice', {
    cache: false,
    url: '/editpicservice/:id',
    views: {
     'menuContent': {
       templateUrl: 'templates/editpicservice.html',
       controller: 'EditPicServiceCtrl'
     }
    }
  })

  .state('app.addproduct', {
    cache: false,
    url: '/addproduct/:pic/:crop_id',
    views: {
     'menuContent': {
       templateUrl: 'templates/addproduct.html',
       controller: 'AddProductCtrl'
     }
    }
  })

  .state('app.editproduct', {
    cache: false,
    url: '/editproduct/:id',
    views: {
     'menuContent': {
       templateUrl:'templates/editproduct.html',
       controller: 'EditProductCtrl'
     }
    }
  })

  .state('app.addservice', {
    cache: false,
    url: '/addservice/:pic',
    views: {
     'menuContent': {
       templateUrl: 'templates/addservice.html',
       controller: 'AddServiceCtrl'
     }
    }
  })

  .state('app.editservice', {
    cache: false,
    url: '/editservice/:id',
    views: {
     'menuContent': {
       templateUrl:'templates/editservice.html',
       controller: 'EditServicCtrl'
     }
    }
  })

  .state('app.problem', {
    url: '/problem',
    views: {
      'menuContent': {
        templateUrl: 'templates/cropproblemall.html',
        controller: 'ProblemCtrl'
      }
    }
  })

  .state('app.sell', {
    url: '/sell',
    views: {
      'menuContent': {
        templateUrl: 'templates/sell.html',
        controller: 'SellCtrl'
      }
    }
  })

  .state('app.editpicproduct', {
    cache: false,
    url: '/editpicproduct/:id',
    views: {
     'menuContent': {
       templateUrl: 'templates/editpic.html',
       controller: 'EditPicProductCtrl'
     }
    }
  })

  .state('app.detailproduct', {
    url: '/detailproduct/:id/:like/:comment',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailproduct.html',
        controller: 'DetailProductCtrl'
      }
    }
  })

  .state('app.producttimeline', {
    url: '/producttimeline/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/timeline.html',
        controller: 'ProductTimelineCtrl'
      }
    }
  })

  .state('app.chatproduct', {
    url: '/chatproduct/:id/:comment/:name',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat.html',
        controller: 'ChatProductCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })



  .state('app.tabsproduct', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/menuproduct.html"
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

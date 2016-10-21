// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordovaOauth','ngCordova','ngMessages','MyApp.Directives','ng-mfb','ion-gallery'])

.run(function($ionicPlatform) {
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
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('register', {
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
    url: '/addaccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/addaccount.html',
        controller: 'AddAccountCtrl'
      }
    }
  })
  .state('app.editAccount', {
    url: '/editaccount/:data',
    views: {
      'menuContent': {
        templateUrl: 'templates/editaccount.html',
        controller: 'EditAccountCtrl'
      }
    }
  })
  .state('app.addActivities', {
   url: '/addactivities',
   views: {
     'menuContent': {
       templateUrl: 'templates/addactivities.html',
       controller: 'AddActivitiesCtrl'
     }
   }
 })
 .state('app.addProblem', {
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
     url: '/editproblem/:cropp_id',
     views: {
       'menuContent': {
         templateUrl: 'templates/editproblem.html',
         controller: 'EditProblemCtrl'
       }
     }
   })

   .state('app.addnote', {
     url: '/addnote',
     views: {
       'menuContent': {
         templateUrl: 'templates/addnote.html',
         controller: 'AddNoteCtrl'
       }
     }
   })

   .state('app.addmultimedia', {
     url: '/addmultimedia',
     views: {
       'menuContent': {
         templateUrl: 'templates/addmultimedia.html',
         controller: 'AddMultimediaCtrl'
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

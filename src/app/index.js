'use strict';

var app = angular.module('kayak-handicap', ['ngAnimate', 'ngTouch', 'ui.router'])

  .run(function($rootScope, $location, $window){
    // Google Analytics
    $rootScope.$on('$stateChangeSuccess', function(){
      if (!$window.ga) return;
      $window.ga('send', 'pageview', { page: $location.path() });
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('addRace', {
        url: '/',
        template: '<race-form>'
      });

    $urlRouterProvider.otherwise('/');
  });
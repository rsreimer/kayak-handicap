angular.module('kayak-handicap', ['ngAnimate', 'ngTouch', 'ui.router', 'ui.mask'])
    .run(function ($rootScope, $location, $window) {
        "use strict";

        // Google Analytics
        $rootScope.$on('$stateChangeSuccess', function () {
            if (!$window.ga) {
                return;
            }
            $window.ga('send', 'pageview', {page: $location.path()});
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        "use strict";

        $stateProvider
            .state('addRace', {
                url: '/',
                template: '<race-form></race-form>'
            });

        $urlRouterProvider.otherwise('/');
    })

    .constant('apiUrl', 'http://localhost:8080/kayak-handicap-api/');
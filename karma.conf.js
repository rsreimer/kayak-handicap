module.exports = function (config) {
  'use strict';

  config.set({
    frameworks: ['jasmine'],
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-animate.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-touch.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-mocks.js',
      'dist/app*.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/*.js'
    ],
    browsers: ['PhantomJS']
  });
};
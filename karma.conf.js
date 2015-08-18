module.exports = function (config) {
  'use strict';

  config.set({
    frameworks: ['jasmine'],
    files: [
      'dist/vendor*.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'dist/app*.js',
      'test/*.js'
    ],
    browsers: ['PhantomJS']
  });
};
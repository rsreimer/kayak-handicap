'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync');

function browserSyncInit(baseDir, files) {
    browserSync.instance = browserSync.init(files, {
        server: {
            baseDir: baseDir
        },
        port: 80
    });
}

gulp.task('serve', ['watch'], function () {
    browserSyncInit([
        'src',
        '.tmp'
    ], [
        '.tmp/**/*.css',
        'src/assets/images/**/*',
        'src/*.html',
        'src/**/*.html',
        'src/**/*.js'
    ]);
});

gulp.task('serve:dist', ['build'], function () {
    browserSyncInit('dist');
});
'use strict';

var gulp = require('gulp');

gulp.task('watch', function () {
  gulp.watch('src/**/*.less', ['styles']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('src/assets/images/**/*', ['images']);
});

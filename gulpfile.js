// TODO: Only compiled new files.
// TODO: ES2015 babel support

/////////////////////////////////////////////////////////////////////////////////////
//
// configuration
//
/////////////////////////////////////////////////////////////////////////////////////

var app = {
  moduleName: 'kayak-handicap'
};

var paths = {
  output: './dist',
  index: './src/index.html',
  styles: './src/**/*.sass',
  scripts: './src/**/*.js',
  templates: './src/components/**/*.html',
  tests: './test'
};

/////////////////////////////////////////////////////////////////////////////////////
//
// loads modules
//
/////////////////////////////////////////////////////////////////////////////////////

var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  del = require('del'),
  sass = require('gulp-sass'),
  karma = require('gulp-karma'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),
  ngAnnotate = require('gulp-ng-annotate'),
  minifyHtml = require('gulp-minify-html'),
  merge = require('merge-stream'),
  angularTemplateCache = require("gulp-angular-templatecache"),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
  del([
    paths.output
  ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function() {
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs karma tests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('test', ['build-js'], function() {
  return gulp.src(paths.test)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      console.log('karma tests failed: ' + err);
      throw err;
    });
});
/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean'], function() {
  var templates = gulp.src(paths.templates)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplateCache({
      module: app.moduleName
    }));

  var scripts = gulp.src(paths.scripts);

  return merge(scripts, templates)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// full build, applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', ['clean', 'build-css', 'build-template-cache', 'jshint', 'build-js'], function() {
  return gulp.src(paths.index)
    .pipe(cachebust.references())
    .pipe(gulp.dest(paths.output));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
  return gulp.watch([paths.index, paths.templates, paths.styles, paths.scripts], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch','build'], function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: false,
      directoryListing: true,
      open: "http://localhost:8000/dist/index.html"
    }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('dev', ['watch', 'webserver']);

/////////////////////////////////////////////////////////////////////////////////////
//
// builds and tests everything
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['build']);
//gulp.task('default', ['build', 'test']);
// TODO: Validate that only changed files are compiled/minified. Cached and remember should do it.

/////////////////////////////////////////////////////////////////////////////////////
//
// App specific configuration
//
/////////////////////////////////////////////////////////////////////////////////////

var app = {
  module: 'kayak-handicap',
  port: 8000,
  source: {
    index: './src/index.html',
    style: './src/**/*.scss',
    script: './src/**/*.js',
    template: './src/components/**/*.html',
    vendor: {
      style: [
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'
      ],
      script: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        './bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.da.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-touch/angular-touch.min.js',
        './bower_components/angular-ui-mask/dist/mask.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js'
      ]
    }
  },
  output: {
    folder: './dist',
    index: 'index.html',
    style: 'app.css',
    script: 'app.js',
    vendor: {
      style: 'vendor.css',
      script: 'vendor.js'
    }
  },
  test: {
    spec: './test',
    karmaConf: __dirname + '/karma.conf.js'
  }
};


/////////////////////////////////////////////////////////////////////////////////////
//
// Load modules
//
/////////////////////////////////////////////////////////////////////////////////////

var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  babel = require('gulp-babel'),
  del = require('del'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),
  ngAnnotate = require('gulp-ng-annotate'),
  minifyHtml = require('gulp-minify-html'),
  merge = require('merge-stream'),
  angularTemplateCache = require("gulp-angular-templatecache"),
  remember = require('gulp-remember'),
  cache = require('gulp-cached'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  csso = require('gulp-csso'),
  CacheBuster = require('gulp-cachebust'),
  cachebust = new CacheBuster(),
  KarmaServer = require('karma').Server;

/////////////////////////////////////////////////////////////////////////////////////
//
// Clean the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
  del([app.output.folder], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Compile sass
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
  // Vendor
  gulp.src(app.source.vendor.style)
    .pipe(concat(app.output.vendor.style))
    .pipe(cachebust.resources())
    .pipe(gulp.dest(app.output.folder));

  return gulp.src(app.source.style)
    .pipe(sourcemaps.init())
    .pipe(cache('style'))
    .pipe(sass())
    .pipe(csso())
    .pipe(remember('style'))
    .pipe(concat(app.output.style))
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(app.output.folder));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Run jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
  gulp.src(app.source.script)
    .pipe(cache('jshint'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Run karma tests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('test', ['build-js'], function(done) {
  new KarmaServer({
    configFile: app.test.karmaConf
  }, done).start();
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Minify Javascript and cache templates
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean'], function() {
  // Vendor
  gulp.src(app.source.vendor.script)
    .pipe(concat(app.output.vendor.script))
    .pipe(cachebust.resources())
    .pipe(gulp.dest(app.output.folder));

  // Template cache
  var templates = gulp.src(app.source.template)
    .pipe(cache('template'))
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(remember('template'))
    .pipe(angularTemplateCache({
      module: app.module
    }));

  return merge(gulp.src(app.source.script), templates)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(cache('script'))
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(remember('script'))
    .pipe(concat(app.output.script))
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(app.output.folder));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Full build
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', ['clean', 'build-css', 'jshint', 'build-js'], function() {
  return gulp.src(app.source.index)
    .pipe(cachebust.references())
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(app.output.folder));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Watch file system and rebuild on changes
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
  var src = app.source;
  return gulp.watch([src.index, src.script, src.style, src.template, src.vendor.script, src.vendor.style], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Launch web server with livereload
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('serve', ['watch','build'], function() {
  gulp.src(app.output.folder)
    .pipe(webserver({
      port: app.port,
      livereload: true,
      fallback: app.output.index,
      open: 'http://localhost:' + app.port
    }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build and test everything
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['serve', 'test']);

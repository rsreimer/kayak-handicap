// TODO: Only compiled new files.
// TODO: ES2015 babel support

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
    style: './src/**/*.sass',
    script: './src/**/*.js',
    template: './src/components/**/*.html'
  },
  output: {
    folder: './dist',
    index: 'index.html',
    style: 'app.css',
    script: 'app.js',
    sourceMapFolder: './'
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
  del = require('del'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),
  ngAnnotate = require('gulp-ng-annotate'),
  minifyHtml = require('gulp-minify-html'),
  merge = require('merge-stream'),
  angularTemplateCache = require("gulp-angular-templatecache"),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  CacheBuster = require('gulp-cachebust'),
  cachebust = new CacheBuster();

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
  return gulp.src(app.source.style)
    .pipe(sourcemaps.init())
    .pipe(concat(app.output.style))
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write(app.output.sourceMapFolder))
    .pipe(gulp.dest(app.output.folder));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Run jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
  gulp.src(app.source.script)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Run karma tests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('test', ['build-js'], function(done) {
  var Server = require('karma').Server;

  new Server({
    configFile: app.test.karmaConf
  }, done).start();
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Minify Javascript and cache templates
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean'], function() {
  var templates = gulp.src(app.source.template)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplateCache({
      module: app.module
    }));

  var scripts = gulp.src(app.source.script);

  return merge(scripts, templates)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat(app.output.script))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write(app.output.sourceMapFolder))
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
  return gulp.watch([src.index, src.script, src.style, src.template], ['build']);
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
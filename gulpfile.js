'use strict';

/*
 * $ npm install gulp -g
 * $ npm install
 */

// load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    please = require('gulp-pleeease'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    rename = require('gulp-rename'),
    browsersync = require('browser-sync'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    fs = require('fs');

// styles
gulp.task('styles', function() {
  return sass('app/assets/styles/main.scss')
  .on('error', function (err) {
    console.error('Error!', err.message);
  })
  .pipe(plumber())
  .pipe(please({
    fallbacks: {
      autoprefixer: ['last 4 versions']
    },
    optimizers: {
      minifier: true
    }
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/assets/styles'));
});

// scripts
gulp.task('scripts', function() {
  return gulp.src([
    'app/assets/scripts/**/*.js',
    '!app/assets/scripts/libs/*.js',
    '!app/assets/scripts/plugins/*.js'
  ])
  .pipe(plumber())
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/assets/scripts'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/scripts'));
});

// do not concatenate library scripts. just for copy.
gulp.task('libs', function() {
  return gulp.src([
    'app/assets/scripts/libs/*.js'
  ])
  .pipe(gulp.dest('dist/assets/scripts/libs'));
});

// vendor scripts
gulp.task('plugins', function() {
  return gulp.src([
    'app/assets/scripts/plugins/*.js'
  ])
  .pipe(concat('plugins.js'))
  .pipe(gulp.dest('dist/assets/scripts'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/scripts'));
});

// fonts
gulp.task('fonts', function() {
  return gulp.src([
    'app/assets/fonts/**/*'
  ])
  .pipe(gulp.dest('dist/assets/fonts'));
});

// images
gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
  .pipe(plumber())
  .pipe(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/assets/images'));
});

// templates
gulp.task('templates', function() {
  return gulp.src([
    'app/templates/**/*.pug',
    '!app/templates/_layouts/*.pug',
    '!app/templates/_includes/*.pug'
  ])
  .pipe(data(function(file) {
    return {
      'meta': JSON.parse(fs.readFileSync('./app/assets/data/meta.json')),
      'index': JSON.parse(fs.readFileSync('./app/assets/data/index.json'))
    }
  }))
  .pipe(plumber())
  .pipe(pug({ pretty: true }))
  .pipe(gulp.dest('dist'));
});

// clean
gulp.task('clean', function() {
  return del([
    'dist/assets/styles',
    'dist/assets/scripts',
    'dist/assets/images'
  ]);
});

// browsersync
gulp.task('browsersync', function() {
  return browsersync.init(null, {
    server: {
      baseDir: './dist'
    },
    startPath: '/html',
    notify: false,
    open: false
  });
});

gulp.task('reload', function () {
  browsersync.reload();
});

// default task
gulp.task('default', ['clean'], function() {
  gulp.start('templates', 'styles', 'scripts', 'plugins', 'libs', 'images', 'fonts');
});

// watch
gulp.task('watch', ['browsersync'], function() {

  // templates
  gulp.watch('app/templates/**/*.pug', ['templates']);
  gulp.watch('app/assets/data/**/*.json', ['templates']);

  // assets
  gulp.watch('app/assets/styles/**/*.scss', ['styles']);
  gulp.watch('app/assets/scripts/**/*.js', ['scripts']);
  gulp.watch('app/assets/images/**/*', ['images']);

  // watch any files in assets/, must be reload on change
  gulp.watch([
    '**/*.html',
    'dist/assets/**'
  ], ['reload']);

});

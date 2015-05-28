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
    jade = require('gulp-jade');

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
        '!app/assets/scripts/vendor/*.js'
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

// bower components
gulp.task('bower', function() {
    return gulp.src([
      'app/libs/**/*'
    ])
    .pipe(gulp.dest('dist/libs'));
} );

// vendor scripts
gulp.task('vendor', function() {
    return gulp.src([
        'app/assets/scripts/vendor/*.js'
    ])
    .pipe(concat('vendor.js'))
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
gulp.task('templates', function () {
    gulp.src([
        'app/templates/**/*.jade',
        '!app/templates/_layouts/*.jade',
        '!app/templates/_includes/*.jade'
    ])
    .pipe(plumber())
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('dist'));
});

// clean
gulp.task('clean', function(cb) {
  del([
    'dist/assets/styles',
    'dist/assets/scripts',
    'dist/assets/images'
  ], cb);
});

// browsersync
gulp.task('browsersync', function() {
  return browsersync.init(null, {
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('reload', function () {
  browsersync.reload();
});

// default task
gulp.task('default', ['clean'], function() {
    gulp.start('templates', 'styles', 'scripts', 'vendor', 'images', 'fonts', 'bower');
});

// watch
gulp.task('watch', ['browsersync'], function() {

    // watch templates
    gulp.watch('app/templates/**/*.jade', ['templates']);

    // watch assets
    gulp.watch('app/assets/styles/**/*.scss', ['styles']);
    gulp.watch('app/assets/scripts/**/*.js', ['scripts']);
    gulp.watch('app/assets/images/**/*', ['images']);

    // watch any files in assets/, must be reload on change
    gulp.watch([
        '**/*.html',
        'dist/assets/**'
    ], ['reload']);
});

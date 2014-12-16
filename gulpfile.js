'use strict';

/*
 * $ npm install gulp -g
 * $ npm install browser-sync gulp gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-rename gulp-cache gulp-plumber gulp-jade --save-dev
 */

// load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    browsersync = require('browser-sync'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade');

// styles
gulp.task('styles', function() {
    return gulp.src([
        'app/assets/styles/main.scss'
    ])
    .pipe(plumber())
    .pipe(sass({
        loadPath: process.cwd() + '/' + 'app/assets/styles',
        style: 'compressed'
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(browsersync.reload({stream: true}));
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
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(browsersync.reload({stream: true}));
});

// vendor scripts
gulp.task('vendor', function() {
    return gulp.src([
        'app/assets/scripts/vendor/*.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(browsersync.reload({stream: true}));
});

// fonts
gulp.task('fonts', function() {
    return gulp.src([
        'app/assets/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browsersync.reload({stream: true}));
});

// images
gulp.task('images', function() {
    return gulp.src('app/assets/images/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browsersync.reload({stream: true}));
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
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.reload({stream: true}));
});

// clean
gulp.task('clean', function() {
    return gulp.src(['dist/assets/styles', 'dist/assets/scripts', 'dist/assets/images'], {read: false})
    .pipe(clean());
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
    gulp.start('templates', 'styles', 'scripts', 'vendor', 'images', 'fonts');
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

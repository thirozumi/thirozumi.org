'use strict';

/*
 * $ npm install
 */

const gulp = require('gulp'),
      cache = require('gulp-cache'),
      sass = require('gulp-sass'),
      pug =  require('gulp-pug'),
      concat = require('gulp-concat'),
      uglify =  require('gulp-uglify-es').default,
      plumber = require("gulp-plumber"),
      autoprefixer = require("gulp-autoprefixer"),
      jshint = require("gulp-jshint"),
      rename = require("gulp-rename"),
      data = require("gulp-data"),
      browsersync = require("browser-sync").create(),
      fs = require('fs'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      changed = require('gulp-changed');

const dist = 'docs',
      startPath = './';

gulp.task('clean', function() {
  return del([
    dist + '/**/*.html',
    dist + '/assets'
  ]);
});

gulp.task('images', function (done) {
  gulp.src('app/assets/images/**/*.{png,jpg,gif,svg}')
    .pipe(changed(dist + '/assets/images'))
    .pipe(cache(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false }
        ]
      })
    ])))
    .pipe(gulp.dest(dist + '/assets/images'))
    done();
});

gulp.task('styles', function (done) {
  gulp.src('app/assets/styles/main.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      "overrideBrowserslist": [
      "last 1 version",
      "> 1%",
      "maintained node versions",
      "not dead"
    ]}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dist + '/assets/styles'))
    .pipe(browsersync.stream());
  done();
});

gulp.task('templates', function (done) {
  const option = {
    pretty: true
  }
  gulp.src([
    'app/templates/**/*.pug',
    '!app/templates/_layouts/*.pug'
    ])
    .pipe(data(function(file) {
      return {
        'meta': JSON.parse(fs.readFileSync('app/assets/data/meta.json'))
      }
    }))
    .pipe(plumber())
    .pipe(pug(option))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
  done();
});

gulp.task('scripts', function(done){
  gulp.src([
    'app/assets/scripts/**/*.js',
    '!app/assets/scripts/plugins/*.js'
  ])
  .pipe(plumber())
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  .pipe(concat('main.js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest(dist + '/assets/scripts'))
  done();
});

gulp.task('sounds', function() {
  return gulp.src([
    'app/assets/sounds/**/*'
  ])
  .pipe(gulp.dest(dist + '/assets/sounds'));
});

gulp.task('dev', function(done) {
  browsersync.init({
    server: {
      baseDir: dist
    },
    startPath: startPath,
    notify: false,
    open: 'external'
  });
  gulp.watch(['app/assets/styles/**/*.scss'], gulp.task('styles'));
  gulp.watch(['app/assets/scripts/**/*.js'], gulp.task('scripts'));
  gulp.watch(['app/assets/images/**/*.{png,jpg,gif,svg}'], gulp.task('images'));
  gulp.watch(['app/templates/**/*.pug','app/assets/data/**/*.json'], gulp.task('templates'));
  done();
});

gulp.task('build', gulp.series('clean', 'templates','styles','scripts', 'sounds', 'images'));
gulp.task('default', gulp.task('build'));
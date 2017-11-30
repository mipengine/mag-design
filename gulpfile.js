/**
 * @file build mag design components
 * @author dongshihao<dongshihao@baidu.com>
 */
'use strict';

const fs = require('fs');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const rimraf = require('gulp-rimraf');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const minimist = require('minimist');

const runTimestamp = Math.round(Date.now() / 1000);
const options = minimist(process.argv.slice(2));
const paths = {
  srcBase: 'src/',
  baseFile: 'src/main.styl',
	src: 'src/**/*.styl',
	dist: 'dist',
	distModule: 'dist',
	demo: 'src/**/*.html',
	example: 'example',
  tools: 'tools/'
};

gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(rimraf());
});

gulp.task('iconfont', function () {
  const fontName = 'mag-icon';
  return gulp.src(['src/icons/svg/*.svg'])
  .pipe(iconfontCss({
    fontName: fontName,
    fontPath: 'fonts/',
    targetPath: '../../src/icons/icons.css',
    cssClass: 'mag-icon'
  }))
  .pipe(iconfont({
    fontName: fontName,
    prependUnicode: true,
    formats: ['ttf', 'eot', 'woff'],
    timestamp: runTimestamp,
    normalize: true,
    fontHeight: 1000
  }))
  .on('glyphs', function(glyphs, options) {
    console.log(glyphs, options);
  })
  .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('build', ['iconfont'], function () {
  return gulp.src(paths.baseFile)
    .pipe(sourcemaps.init())
    .pipe(stylus({
      paths:[ './node_modules/', './node_modules/*/', './src/base/' ],
      import: ['variables', 'mixins'],
      'include css': true
    }))
    .pipe(cleanCSS())
    .pipe(rename('mag-design.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('preview', ['build'], function () {
  browserSync.init([paths.src, paths.demo], {
    server: {
      baseDir: './',
      directory: false,
      routes: {
        "/": paths.example
      }
    },
    open: false
  });
  gulp.watch([paths.src], ['build']);
  gulp.watch([paths.example + '/**']).on("change", browserSync.reload);
});

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

const path = require('path'),
    spritesmith = require('gulp.spritesmith'),
    imageResize = require('gulp-image-resize'),
    autowatch = require('gulp-autowatch'),
    less = require('gulp-less'),
    sloc = require('gulp-sloc2'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    inject = require('gulp-inject');

const paths = {
    index: './templates/*.html',
    less: './*.less',
    app: 'js/**/*.js',
};

gulp.task('babel-src', () => {
    return gulp.src('js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('babel-tests', () => {
    return gulp.src('tests/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/tests'))
});

gulp.task('babel', ['babel-src', 'babel-tests']);

gulp.task('tests', ['babel'], function () {
    return gulp.src(['build/tests/test.*.js'], {read: false})
        .pipe(mocha({
            require: [
                'source-map-support/register'
            ],
            // grep: '',
            reporter: 'nyan',
        }));
});

gulp.task('index', () => {
    return gulp.src('./index.tmpl.html')
        .pipe(rename('index.html'))
      .pipe(inject(gulp.src(['./templates/*.html']), {
        starttag: '<!-- inject:templates:{{ext}} -->',
        transform: function (filePath, file) {
          return file.contents.toString('utf8')
              .replace('<body>', `<template data-name="${path.basename(filePath, '.html')}">`)
              .replace('</body>', '</template>')
        }
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('less', () => {
    return gulp.src('./*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('tiles-resize', () => {
    return gulp.src('tiles/*.png')
        .pipe(imageResize({width: '45'}))
        .pipe(gulp.dest('./build/tiles'));
});

gulp.task('css-sprites', ['tiles-resize'], () => {
    return gulp.src('./build/tiles/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  })).pipe(gulp.dest('./dist'))
});

gulp.task('sloc', () => {
    gulp.src(['js/*.js', 'tests/**.js', 'templates/*.html'])
        .pipe(sloc({
            metrics: ['total', 'source', 'comment', 'empty']
        }));
});

gulp.task('app', () => {
    return browserify({
        entries: ['./js/init.js'],
        debug: true})
        .transform(babelify, {
            sourceMaps: true
        })

        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  autowatch(gulp, paths);
});

gulp.task('default', ['index', 'less', 'css-sprites', 'app']);
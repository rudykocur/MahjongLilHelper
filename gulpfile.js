const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

const path = require('path'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    inject = require('gulp-inject');

gulp.task('babel-src', () => {
    return gulp.src('js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('babel-tests', () => {
    return gulp.src('tests/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/tests'))
});

gulp.task('babel', ['babel-src', 'babel-tests']);

gulp.task('tests', ['babel'], function () {
    return gulp.src(['dist/tests/test.*.js'], {read: false})
        .pipe(mocha({
            require: [
                'source-map-support/register'
            ],
            reporter: 'spec',
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
      .pipe(gulp.dest('./'));
});

gulp.task('default', ['index'], () => {
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
        .pipe(gulp.dest('./'));
});
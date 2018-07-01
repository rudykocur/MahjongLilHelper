const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

const babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify');

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

gulp.task('default', () => {
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
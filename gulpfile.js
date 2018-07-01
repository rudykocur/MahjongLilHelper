const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

gulp.task('babel-src', () => {
    return gulp.src('js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('babel-tests', () => {
    return gulp.src('tests/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
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
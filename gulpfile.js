/* eslint no-console:0 */

const pump = require('pump');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');

const gulp = require('gulp');

gulp.task('default', () => {
    // Nothing to see here
});

gulp.task('compressJS', (cb) => {
    pump([
        gulp.src('src/**/*.js'),
        sourcemaps.init(),
        babel({presets: [['env', {'modules': false, 'targets': {'ie': 11}}], 'minify']}),
        sourcemaps.write('.'),
        gulp.dest('./prod/')
    ], cb);
});

gulp.task('compressCSS', (cb) => {
    pump([
        gulp.src('src/**/*.css'),
        sourcemaps.init(),
        postcss(),
        sourcemaps.write('./'),
        gulp.dest('./prod/')
    ], cb);
});

gulp.watch('src/**/*.js', ['compressJS']);
gulp.watch('src/**/*.css', ['compressCSS']);

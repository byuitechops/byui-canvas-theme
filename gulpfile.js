/* eslint no-console:0 */

const pump = require('pump');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');

const gulp = require('gulp');


gulp.task('default', () => {
    // Nothing to see here...
});

gulp.task('compressJS', (cb) => {
    pump([
        gulp.src('src/**/*.js'),
        babel({presets: [['env', {'modules': false}], 'minify']}),
        gulp.dest('./prod/')
    ], cb);
});

gulp.task('compressCSS', (cb) => {
    pump([
        gulp.src('src/**/*.css'),
        cleanCSS(),
        gulp.dest('./prod/')
    ], cb);
});

gulp.watch('src/**/*.js', ['compressJS']);
gulp.watch('src/**/*.css', ['compressCSS']);

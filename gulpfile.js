/* eslint no-console:0 */

const pump = require('pump');
const babel = require('gulp-babel');
// const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
// const postcssCustomProperties = require('postcss-custom-properties');
// const cssNano = require('cssnano');

const gulp = require('gulp');

gulp.task('default', () => {
    // Nothing to see here...
});

gulp.task('compressJS', (cb) => {
    pump([
        gulp.src('src/**/*.js'),
        sourcemaps.init(),
        babel({presets: [['env', {'modules': false, 'targets': {'ie': 11}}], 'minify']}),
        // babel({presets: [['env', {'modules': false, 'targets': {'ie': '11'}}]]}),
        sourcemaps.write('.'),
        gulp.dest('./prod/')
    ], cb);
});

gulp.task('compressCSS', (cb) => {
    pump([
        gulp.src('src/**/*.css'),
        sourcemaps.init(),
        postcss(),
        // cleanCSS(),
        sourcemaps.write('./'),
        gulp.dest('./prod/')
    ], cb);
});

gulp.watch('src/**/*.js', ['compressJS']);
gulp.watch('src/**/*.css', ['compressCSS']);

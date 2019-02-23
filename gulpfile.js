const pump = require('pump');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const cssnano = require('cssnano');


const gulp = require('gulp');


function compressJS(cb) {
    pump([
        gulp.src('src/**/*.js'),
        sourcemaps.init(),
        babel({
            presets: [
                ['env', {
                    'modules': false,
                    'targets': {
                        'ie': 11
                    }
                }], 'minify'
            ]
        }),
        sourcemaps.write('.'),
        gulp.dest('./prod/')
    ], cb);
}

function compressCSS(cb) {
    pump([
        gulp.src('src/**/*.css'),
        sourcemaps.init(),
        postcss([
            postcssCustomProperties({
                'preserve': true // false to completely remove css3 vars from prod
            }),
            cssnano()
        ]),
        sourcemaps.write('./'),
        gulp.dest('./prod/')
    ], cb);
}


exports.default = () => {
    gulp.watch('src/**/*.js', compressJS);
    gulp.watch('src/**/*.css', compressCSS);
}
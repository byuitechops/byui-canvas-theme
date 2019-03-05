const pump = require('pump');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const cssnano = require('cssnano');
const header = require('gulp-header');
const gulp = require('gulp');
var browserSync = require('browser-sync');

var pjson = require('./package.json');
var versionNumber = pjson.version;


function serve(cb) {
    browserSync.init({
        port: 8000,
        server: {
            baseDir: './'
        },
        startPath: 'index.html'
    });
    gulp.watch('src/**/*.js', compressJS);
    gulp.watch('src/**/*.css', compressCSS);
    gulp.watch(['src/**/*.js', 'src/**/*.css'], browserSync.reload);
    cb();
}

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
        header(`/*v ${versionNumber}*/`),
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
        header(`/*v ${versionNumber}*/`),
        sourcemaps.write('./'),
        header('hello emma'),
        gulp.dest('./prod/')
    ], cb);
}

exports.default = gulp.series(serve);

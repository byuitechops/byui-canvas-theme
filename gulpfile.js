const pump = require('pump');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');
const headerComment = require('gulp-header-comment');

var browserSync = require('browser-sync');

var reload = browserSync.reload;

var file = fs.readFileSync(path.resolve('./gulpfile.js'), { encoding: "utf8" });
var versionNumber = file.version;


const gulp = require('gulp');


gulp.task('serve', function () {
    browserSync.init({
        port: 8000,
        // host: "127.0.0.1",
        server: {
            baseDir: 'prod'
        },
        startPath: './index.html'
    });
    gulp.watch(['src/**/*.js', 'src/**/*.css'], { cwd: 'prod' }, [reload, compressJS, compressCSS]);
});



function compressJS(cb) {
    pump([
        gulp.src('src/**/*.js')
            .pipe(headerComment(`version ${versionNumber}`)),
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

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

var file = fs.readFileSync(path.resolve('./gulpfile.js'), { encoding: "utf8" });
var versionNumber = file.version;


const gulp = require('gulp');


// gulp.task('serve', function () {
//     browserSync.init({
//         injectChanges: true,
//         port: 8000,
//         server: {
//             baseDir: './'
//         },
//         files: ['src/**/*.js']
//         // startPath: 'index.html'
//     });
//     gulp.watch('src/**/*.js', compressJS);
//     gulp.watch('src/**/*.css', compressCSS);
//     gulp.watch('src/**/*.js', ['js-watch']);
// });

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: './'
        }
    });
    done();
}




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

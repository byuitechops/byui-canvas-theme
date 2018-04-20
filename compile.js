/* eslint no-console:0 */

const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const asyncLib = require('async');

const options = {
    presets: ['env']
};

const ignoredFiles = ['compile.js'];

function readDirectory() {
    fs.readdir('.', (readErr, files) => {
        if (readErr) {
            console.error(chalk.red(readErr));
            return;
        }
        files = files.filter(file => path.extname(file) === '.js' && !ignoredFiles.includes(file));

        console.log(files);
    });
}


function babelifyFile(file, cb) {

    babel.transformFile('online.js', options, (babelErr, result) => {
        if (babelErr) {
            console.error(babelErr);
            return;
        }

        // TODO I'm sure I can turn off use-strict as an option in babel. But you know. Effort...
        var code = result.code.replace(/'use strict';(\n|\r)*/ig, '');
        cb(null, code);
    });
}

function saveFile(file, cb) {
    fs.writeFile('online-compiled.js', code, (writeErr) => {
        if (writeErr) {
            cb(writeErr);
            return;
        }
        console.log('Wrote online-compiled.js');
        cb(null);
    });
}
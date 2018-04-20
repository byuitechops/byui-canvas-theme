/* eslint no-console:0 */

const fs = require('fs');
const path = require('path');
const asyncLib = require('async');
const chalk = require('chalk');
const babel = require('babel-core');


const ignoredJSFiles = ['compile.js'];
const outputLocation = './production/';
const fileLimit = 2;
const babelOpts = {
    presets: ['env']
};

function saveFile(fileName, fileGuts, eachCB) {
    fs.writeFile(`${outputLocation}${fileName}`, fileGuts, (writeErr) => {
        if (writeErr) {
            console.error(chalk.red(writeErr));
        } else {
            console.log(chalk.green(`Wrote ${fileName}`));
        }

        eachCB(null);
    });
}

function babelifyFile(fileName, eachCB) {
    babel.transformFile(fileName, babelOpts, (babelErr, result) => {
        if (babelErr) {
            console.error(chalk.red(babelErr));
            eachCB(null);
            return;
        }
        // TODO I'm sure I can turn off use-strict as an option in babel. But you know. Effort...
        var fileGuts = result.code.replace(/'use strict';(\n|\r)*/ig, '');

        saveFile(fileName, fileGuts, eachCB);
    });
}


function copyFile(fileName, cb) {
    // TODO idk how to do this off the top of my head
    fs.readFile(fileName, (readErr, fileGuts) => {
        if (readErr) {
            console.error(chalk.red(readErr));
            cb(null);
            return;
        }
        fs.writeFile(`${outputLocation}${fileName}`, fileGuts, (writeErr) => {
            if (writeErr) {
                console.error(chalk.red(readErr));
            } else {
                console.log(chalk.green(`Moved ${fileName}`));
            }
            cb(null);
        });
    });
}


function readDirectory() {
    /* read in all files */
    fs.readdir('.', (readErr, files) => {
        if (readErr) {
            console.error(chalk.red(readErr));
            return;
        }

        var jsFiles = [],
            cssFiles = [];

        /* create obj with all JS files & all CSS files */
        files.forEach(file => {
            if (path.extname(file) === '.js' && !ignoredJSFiles.includes(file)) {
                jsFiles.push(file);
            } else if (path.extname(file) === '.css') {
                cssFiles.push(file);
            }
        });

        /* Do work! */
        asyncLib.eachLimit(jsFiles, fileLimit, babelifyFile, (jsErr) => {
            if (jsErr) {
                console.error(chalk.red(jsErr));
            }
            asyncLib.eachLimit(cssFiles, fileLimit, copyFile, (cssErr) => {
                if (cssErr) {
                    console.error(chalk.red(cssErr));
                }

                console.log(chalk.blue('done'));
            });
        });
    });
}

readDirectory();
### Setup
[Gulp](https://www.npmjs.com/package/gulp) is used to optimize both JS and CSS files. This optimization includes the following:
- Remove ES6 code from all JS files (using [Babel](https://babeljs.io/))
- Uglify all JS & CSS code
- Replace CSS 3 custom properties with static CSS declarations for IE 11 support (using [postcss](https://github.com/postcss))

Use the `npm start` command to open a live server of your JS and CSS files and start watching for changes in those files.
The `src` directory contains human-readable code while the `prod` directory contains the optimized code for Canvas.
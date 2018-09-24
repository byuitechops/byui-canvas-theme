# BYU-I CANVAS THEME

## Purpose
This is Brigham Young University-Idaho's custom CSS and JS for their Canvas instance. These files are used by students from BYU-Idaho, LDS Business College, and Pathway Worldwide and are distributed across the globe. For this reason it is imperative that these files remain as minimal as possible.


## How to Install

### Development Install
To install for development, navigate to your repository in the console and type:

```
git clone https://github.com/byuitechops/byui-canvas-theme.git
```
Install all development dependencies with:

```
npm i
```


### Canvas Install
To upload files to Canvas:

Follow Canvas's docs [here](https://community.canvaslms.com/docs/DOC-10862-4214724282)


## Development

### Setup
[Gulp](https://www.npmjs.com/package/gulp) is used to optimize both JS and CSS files. This optimization includes the following:
- Remove ES6 code from all JS files (using [Babel](https://babeljs.io/))
- Uglify all JS & CSS code
- Replace CSS 3 custom properties with static CSS declarations for IE 11 support (using [postcss](https://github.com/postcss))

After installing gulp globally, use the `gulp` command to start watching for changes in CSS & JS files.
The `src` directory contains human-readable code while the `prod` directory contains the optimized code for Canvas.

### Dev Notes
- `byui.js` contains will not run if `localStorage['devAccount']` is `true`. This allows us to test changes to this file in a sub-account without having the live version of the file interfere.
- CSS & JS files for the Canvas mobile apps have their own upload location in Canvas. Many of these features will not work on the Mobile app.
- JS files cascade, so a JS file at the top of an account will also run in all sub-accounts. The Dev account is currently being used for testing.
- Please be aware that `byui.js` lives at the very top level of our Canvas instance, and applies to many places that no other sub-account will (ex: the login page). Just know that this script is liable to create bugs that cannot be found in the Dev sub-account.


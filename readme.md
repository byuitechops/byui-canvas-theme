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

## `ByuiThemeLoader` API

### Loader Object
``` js
{
  // Current Version of the ByuiThemeLoader
  version:'0.0.1',
  // If in development then will run verbose and
  // replace any other ByuiThemeLoader it finds
  mode:'development'|'production',
  // The resources that have been defined
  resources: {},
  // The actions that have been defined
  actions: {},
  // Used to define Resources
  defineResource(tag,options){},
  // Used to define Actions
  defineAction(tag,options){},
}
```
### Default Resource Options
``` js
{
  // Array of resource tags that need to be loaded before it
  dependencies:[],
  // Array of script url's that make up the resource
  scripts:[],
  // Array of stylesheet url's that make up the resource
  styles:[],
  // Function that returns a url to send a xhr request to
  // (used in place of 'scripts' & 'styles' if defined)
  xhr:null,
  // Return whether the resource is already initially on the page
  hasExistingInstance: () => false,
  // Return the value that will be passed into run
  // (Usually just the global variable that the resource creates)
  findValue: () => null,
}
```
### Default Action Options
``` js
{
  /* Array of resource tags that it requires */
  dependencies:[],
  /*
    A string or function to tell when to run
    - If a string then used in document.querySelectorAll
      and run is called for each match with the element
      as the 'this' value
    - If a function then if the return is truthy it
      will run with the return value as the 'this' value 
  */
  on: null,
  /*
    The function to run on the page when 'on' says it 
    can. Passed in the values from it's dependencies,
    and with 'this' set to the value of 'on'
  */
  run(){},
}
```


### Example
Lets create an action that downloads the html of a div when it is clicked
#### Defining the resource 
``` js
Loader.defineResource('FileSaver',{
  /* Url of script */
  scripts:['https://fastcdn.org/FileSaver.js/1.1.20151003/FileSaver.min.js'],
  /* Get the Global Variable Created */
  findValue(){ 
    return window.FileSaver
  }
})
```
#### Defining the action
``` js
Loader.defineAction('downloader',{
  /* Using the resource that we defined */
  dependencies:['FileSaver'],
  /* If there is a div with the class .downloadme on the page */
  on:() => document.querySelectorAll('div.downloadme')
  /* Which is the same as */
  on:'div.downloadme',
  /* 
    run is called for each 'div.downloadme' on the page with the element
    as the 'this' value, and the dependencies values as the arguments
  */
  run(FileSaver){
    // the html of the div
    var html = this.innerHTML

    // Setting the click listener
    this.onclick = function(){

      // Using FileSaver
      var blob = new Blob([html],{type:'text/html;charset=utf-8'})
      FileSaver.saveAs(blob,'downloaded.html')

    }
  }
})
```

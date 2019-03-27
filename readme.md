# BYU-I CANVAS THEME

## Purpose
This is Brigham Young University-Idaho's custom CSS and JS for their Canvas instance. These files are used by students from BYU-Idaho, LDS Business College, and Pathway Worldwide and are distributed across the globe. For this reason it is imperative that these files remain as minimal as possible.


## How to Install

### Development Install

1. Clone this repository:
    ```bash
    git clone https://github.com/byuitechops/byui-canvas-theme.git
    ```
1. Step into the folder that was just created 
    ```bash
    cd ./byui-canvas-theme
    ```
1. To install dependancies, run:
    ```bash
    npm i
    ```


### Canvas Install
To upload files to Canvas:

**You MUST thoroughly test these files before uploading them to Canvas. Changes will affect thousands of students globally.**

1. You need to get the proper permissions to upload to Canvas. Contact Dane Bohman to get access to change the theme in the test instance and development subaccount of Canvas.

1. Follow Canvas's docs [here](https://community.canvaslms.com/docs/DOC-10862-4214724282) for a step-by-step guide of how to upload the CSS and JS files.
    * Keep in mind that uploading to BYUI theme trickles down to Development, Online, and any other subaccounts, so the files need only be uploaded to the top level (BYU-Idaho).


## How to Test

1. Upload the updated JS and CSS files to the test instance of Canvas as a new theme
    * Open a web page in the test instance of Canvas
    * Click Admin > BYU-Idaho > Themes
    * Click the button in the top right corner labeled '+Theme' and choose the name of the current theme
    * Under the Upload tab, select the new file(s) you want to upload, then preview your changes
    * Save theme and rename it to include the current date and your name
    * Apply theme

You can now observe how your changes affect the look and functionality of Canvas

1. Once you feel confident in your changes within the test instance, you can apply the changes to the Development subaccount in the regular instance of Canvas
    * Open a web page in Canvas
    * Click Admin > Development > Themes
    * Hover over the current theme and click 'Open in Theme Editor'
    * Under the Upload tab, select the new file(s) you want to upload, then preview your changes
    * Save theme and apply theme

Now remember, the BYU-Idaho theme is still trickling down into development, so you need to disable that JS file in order to really test the files uploaded in the Development subaccount. We are currently using a Chrome Extension called Resource Override to do this.

1. Navigate to [the extension](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii) in the Chrome Web Store

1. Click Add to Chrome > Add extension. You may also want to watch the provided demo video to better understand the tool ad how it works.

1. This particular extension will appear in Developer Tools under the Overrides tab
    * For the tab URL, enter \*byui.instructure.com/* or \*byui.test.instructure.com/* depending on if you are in the test instance or not
    * In the 'From' section, you will put the name of the file you are trying to replace. In this case, either \*byui.js or \*byui.css
    * In the 'To' section, you will put the URL of your JS or CSS file generated from live-server
    * When you reload the page, the tool should replace the current byui.js or byui.css file with the file URL you have provided


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


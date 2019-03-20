# BYU-I CANVAS THEME

## Purpose
This is Brigham Young University-Idaho's custom CSS and JS for their Canvas instance. These files are used by students from BYU-Idaho, LDS Business College, and Pathway Worldwide and are distributed across the globe. For this reason it is imperative that these files remain as minimal as possible.

## Permissions
You need to get the proper permissions to upload to Canvas. Contact Dane Bohman to get access to change the theme in the test instance and development subaccount of Canvas.

## Theme Change Requests
> TODO: addd link to the way we collect problems
Change Requests are submitted via Google Forms/Microsoft Forms/Team Dynamics? and can be found [here](#). There are three categories of fixes, and each has a slightly different process. Please carefully follow the instructions below for each of the types of fixes:


### Simple Existing Solution
> TODO: definition:
1. Simple email the requestor with an explanation


### Bug Fix
> TODO: definition:
1. If a local copy of this repo doeesn't exist on your computer, [Install](#how-to-install) 
1. Create a new branch with the name of the bug fix
1. Solve the problem
1. Build the code following [this process](#how-to-build)
1. Test the code in the test instance of Canvas using [these step-by-step instructions](./test.md)
1. Test the code in the prod instance of Canvas using [these step-by-step instructions](./testprod.md)
1. Once you are certain the bug is fixed, you need to up the version number and merge your branch with master using the command:
    ```bash
    version patch
    ```
1. Contact Dane Bohman and explain that you have a bug fix that is ready to be uploaded to the top level in Canvas
1. If this fix has been requested by someone outside the office, send them an email to let them know that bug fix has been implemented


### Minor or Major Change/Update
> TODO: definition:
1. Research the problem, find examples
1. Make a small presentation explaining the problem as well as potential fixes
1. Meet with the change committee, get change either approved or denied
1. Email the requestor to let them know if it's been approved or denied
1. If denied, stop here. If approved, continue with the rest of the steps
1. Meet with the iLearn governance council, get change either approved or denied 
1. Email the requestor to let them know if it's been approved or denied
1. If denied, stop here. If approved, continue with the rest of the steps
1. If a local copy of this repo doeesn't exist on your computer, [Install](#how-to-install) 
1. Create a new branch with the name of the update
1. Solve the problem
1. Build the code following [this process](#how-to-build)
1. Test the code in the test instance of Canvas using [these step-by-step instructions](./test.md)
1. Test the code in the prod instance of Canvas using [these step-by-step instructions](./testprod.md)
1. Once you are certain the code works and is production quality, you need to up the version number and merge your branch with master using the command:
    ```bash
    version minor
    ```
or
    ```bash
    version major
    ```
depending on the size of the change
1. Submit a CAB request and wait for approval. Read more about the process [here](https://webmailbyui.sharepoint.com/sites/IT/Policies%20and%20Standards/Change%20Management%20Documentation/Change%20Management%20Standard.pdf)
1. Contact Dane Bohman and have him upload the new files to the top level in Canvas with Josh there as well to make sure it happens correctly
1. If this fix has been requested by someone outside the office, send them an email to let them know that the change has been implemented



## How to Install

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

## How to Build
[Gulp](https://www.npmjs.com/package/gulp) is used to optimize both JS and CSS files. This optimization includes the following:
- Remove ES6 code from all JS files (using [Babel](https://babeljs.io/))
- Uglify all JS & CSS code
- Replace CSS 3 custom properties with static CSS declarations for IE 11 support (using [postcss](https://github.com/postcss))

Use the `npm start` command to open a live server of your JS and CSS files and start watching for changes in those files.
The `src` directory contains human-readable code while the `prod` directory contains the optimized code for Canvas.


## Dev Notes
**You MUST thoroughly test these files before uploading them to Canvas. Changes will affect thousands of students globally.**
- CSS & JS files for the Canvas mobile apps have their own upload location in Canvas. Many of these features will not work on the Mobile app.
- JS files cascade, so a JS file at the top of an account will also run in all sub-accounts. The Dev account is currently being used for testing.
- Please be aware that `byui.js` lives at the very top level of our Canvas instance, and applies to many places that no other sub-account will (ex: the login page). Just know that this script is liable to create bugs that cannot be found in the Dev sub-account.
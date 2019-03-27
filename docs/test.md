## How to Test in the test instance of Canvas

Uploading to BYUI theme trickles down to Development, Online, and any other subaccounts, so the files need only be uploaded to the top level (BYU-Idaho).

Upload the updated JS and CSS files to the test instance of Canvas as a new theme
* Open a web page in the test instance of Canvas
* Click Admin > BYU-Idaho > Themes
* Click the button in the top right corner labeled '+Theme' and choose the name of the current theme
* Under the Upload tab, select the new file(s) you want to upload, then preview your changes
* Save theme and rename it to include the current date and your name
* Apply theme

You can now observe how your changes affect the look and functionality of Canvas

If needed, follow Canvas's docs [here](https://community.canvaslms.com/docs/DOC-10862-4214724282) for more information and a step-by-step tutorial with visuals


### Testing Canvas Mobile App

#### Android

1. Turn on developer options by following the directions [here](https://developer.android.com/studio/debug/dev-options)
1. Make sure USB debugging is enabled on the device, within developer options
1. **Change the setting to Audio Source** - elaborate on this
1. Plug the device into the USB port of the computer
1. **If a popup appears on the device, accept it** - elaborate on this
1. Inspect a webpage to open Chrome devtools on the computer
1. In the Elements window, clikc the three little dots in the right corner to open the dropdown menu
1. Click more tools > remote devices
1. Make sure the 'discover USB devices' box is checked
1. Your device should show up as connected in this window
1. Open the web[age or webview you are trying to inspect
1. Click on that link in the devtools and inspect away!
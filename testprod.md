## Testing using the Resource Override Extension


This is the process used to disable the JS or CSS file in prod Canvas in order to test changes we've made to the code.
This process can also be used in initial testing as a way of seeing live updates of the code and how they affect the LMS.

Remember, the BYU-Idaho theme trickles down into development and every other subaccount, so you need to disable that JS file in order to really test the changes. We are currently using a Chrome Extension called Resource Override to do this.

### How to Install

1. Navigate to [the extension](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii) in the Chrome Web Store

1. Click Add to Chrome > Add extension. You may also want to watch the provided demo video to better understand the tool ad how it works.

1. This particular extension will appear in Developer Tools under the Overrides tab
    * For the tab URL, enter \*byui.instructure.com/* or \*byui.test.instructure.com/* depending on if you are in the test instance or not
    * In the 'From' section, you will put the name of the file you are trying to replace. In this case, either \*byui.js or \*byui.css
    * In the 'To' section, you will put the URL of your JS or CSS file generated from live-server (most likely port 8000)
    * Make sure you disable the cache under the Network tab as well, or the tool will not always work
    * When you reload the page, the tool should replace the current byui.js or byui.css file with the file URL you have provided
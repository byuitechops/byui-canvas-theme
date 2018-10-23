const os = require('os');
const rimraf = require('rimraf');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function(){
  // Close Browser
  await global.__BROWSER_GLOBAL__.close()
  // Clean-up endpoint file
  rimraf.sync(DIR);
}
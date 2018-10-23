const fs = require('fs')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const openPuppeteer = require('./openPuppeteer')
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');


module.exports = async function (){
  const [browser,page] = await openPuppeteer()
  await page.close()

  global.__BROWSER_GLOBAL__ = browser
  
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
}
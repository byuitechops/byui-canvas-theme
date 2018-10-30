const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const os = require('os');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {

  constructor(config) {
    super(config);
    this.intercepters = new Map()
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });

    // Create the page
    this.global.page = await this.global.browser.newPage()
  }

  async teardown() {
    await this.global.page.close()
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment
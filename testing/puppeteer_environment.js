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

    this.folder = './src'
    this.jsfile = 'byui.js'
    this.cssfile = 'byui.css'

    // Create the page
    this.global.page = await this.global.browser.newPage()
    this.global.redirect = this.redirect.bind(this)

    this.injectScript()
  }

  redirect (matcher,filepath){
    if(!(matcher instanceof RegExp) && typeof matcher != 'string') 
      throw new Error('Was expecting matcher to be a Regular Expression or String')
    if(typeof filepath != 'string') 
      throw new Error('Was expecting path to be a string')
    if(fs.existsSync(filepath)){
      if(typeof matcher == 'string' && fs.statSync(filepath).isDirectory()){
        filepath = path.join(filepath,matcher)
        console.log('filepath',filepath)
      } else {
        throw new Error('Path is a directory and matcher is not a string')
      }
    } else {
      throw new Error('Path does not exist')
    }
    this.intercepters.set(matcher,filepath) 
  }

  async injectScript(){
    await this.global.page.setRequestInterception(true);
    this.global.page.on('request',request => {
      // Get the last matching intercepter
      var match
      this.intercepters.forEach((filepath,matcher) => {
        if(matcher instanceof RegExp && matcher.test(request.url()))
          match = filepath
        else if(request.url().endsWith(matcher))
          match = filepath
      })
      // Respond with that file's contents
      // console.log(fs.readFileSync(match,'utf-8'))
      if(match){
        console.log('Found a match',match)
        var response = {
          headers:request.headers(),
          body:fs.readFileSync(match,'utf-8') 
        }
        request.respond(response)
      } else {
        request.continue()
      }
    })
  }

  async teardown() {
    // await this.global.page.close()
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment
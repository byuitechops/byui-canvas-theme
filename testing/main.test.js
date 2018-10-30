const puppeteerHandler = require('./puppeteerHandler')
const path = require('path')
const DIR = path.join(__dirname,'../src')
/* Specify which requests to redirect where */
puppeteerHandler.redirect(/byui\.(js|css)$/,DIR)

let browser,page

/* Handle opening and closing the browser */
beforeAll(async () => {
  browser = await puppeteerHandler.open({ headless:true });
  [ page ] = await browser.pages();
})
afterAll(() => browser.close())

describe('homepage',async () => {

  beforeAll(() => page.goto('https://byui.instructure.com/courses/92'))

  test('contains elements',async () => {
    var puppydog = await page.evaluate(() => window.puppydog)
    console.log(puppydog)
  })
  
})
// const puppeteerHandler = require('./puppeteerHandler')
// const path = require('path')
// const DIR = path.join(__dirname,'../src')
/* Specify which requests to redirect where */
// puppeteerHandler.redirect(/byui\.(js|css)$/,DIR)

// let browser,page

// /* Handle opening and closing the browser */
// beforeAll(async () => {
//   browser = await puppeteerHandler.open({ headless:true });
//   [ page ] = await browser.pages();
// })
// afterAll(() => browser.close())

/* Test the homepage menu */
describe('homepage',async () => {

  // beforeAll(() => page.goto('https://byui.instructure.com/courses/92'))

  test('contains elements',async () => {

    const map = {};

    window.addEventListener = jest.fn((event,cb) => map[event] = cb)

    // const initializeCarousel = jest.fn()

    require('../src/byui.js')

    console.log(initializeCarousel)
    // map.load()
    // expect(initializeCarousel).toBeCalled()
    // var puppydog = await page.evaluate(() => window.puppydog)
    // console.log(puppydog)
  })

})
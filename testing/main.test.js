var path = require('path')
var DIR = path.join(__dirname,'../src')
  
beforeAll(() => {
  page.redirect(/byui\.(js|css)$/,DIR)
})

describe('homepage',async () => {

  beforeAll(() => page.goto('https://byui.instructure.com/courses/92'))

  test('contains elements',async () => {
    var puppydog = await page.evaluate(() => window.puppydog)
    console.log(puppydog)
  })
  
})
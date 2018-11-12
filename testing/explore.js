const puppeteerHandler = require('./puppeteerHandler')
const path = require('path')

puppeteerHandler.redirect(/byui\.(css|js)/,path.join(__dirname,'../prod'))

puppeteerHandler.open({
  headless:false,
  defaultViewport:null,
  devtools:true,
}).then(async browser => {

  const [ page ] = await browser.pages()

  await page.goto('https://byui.instructure.com/courses/92/pages/web-features?module_item_id=1891294')

})
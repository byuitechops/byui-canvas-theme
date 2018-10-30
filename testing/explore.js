const puppeteerHandler = require('./puppeteerHandler')
const path = require('path')

puppeteerHandler.redirect(/byui\.(css|js)/,path.join(__dirname,'../src'))

puppeteerHandler.open({
  headless:false,
  defaultViewport:null,
  devtools:true,
}).then(async browser => {

  const [ page ] = await browser.pages()

  await page.goto('https://byui.instructure.com')

})
const puppeteerHandler = require('./puppeteerHandler')

puppeteerHandler.setRedirectFolder('../src')

puppeteerHandler.open({
  headless:false,
  defaultViewport:null,
  devtools:true,
}).then(async browser => {

  const [ page ] = await browser.pages()

  page.on('load',async () => {
    console.log('marco')
    await page.evaluate(() => {
      window.addEventListener('load',() => {
        console.log('polo')
      })
    })
  })

  // await page.exposeFunction('onByuiLoader',function (loader){
  //   console.log('caughtit',loader)
  // })

  // page.on('domcontentloaded',async () => {
  //   await page.evaluate(() => {
  //     window.ByuiThemeLoader.onload = () => console.log('gotcha!')
  //   })
  // })

  // await page.evaluateOnNewDocument(() => {
  //   Object.defineProperty(window,'ByuiThemeLoader',{
  //     configurable:true,
  //     set(loader){
  //       window.onByuiLoader(loader)
  //       delete this.ByuiThemeLoader
  //       this.ByuiThemeLoader = loader
  //     }
  //   })
  // })

  await page.goto('https://byui.instructure.com/courses/92/pages/web-features?module_item_id=1891294')

  // await page.addScriptTag({path:'./node_modules/sinon/pkg/sinon.js'})

})
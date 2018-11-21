module.exports.redirect = function (match,filepath){
  

  var isMatch,getPath

  if(match.test != undefined){
    isMatch = url => match.test(url)
  } else if(typeof match == 'string'){
    isMatch = url => url.endsWith(match)
  } else {
    throw new Error('Redirect must have \'match\' property')
  }

  if(typeof filepath == 'string'){
    if(fs.existsSync(filepath)){
      if(fs.statSync(filepath).isDirectory()){
        /* If they gave us a directory, then use the file paths name */
        getPath = url => path.join(filepath,path.basename(url))
      } else {
        getPath = () => filepath
      }
    } else {
      throw new Error('resource does not exist')
    }
  } else {
    throw new Error('Was expectng Resource path to be a string')
  }

  Redirects.push({isMatch,getPath})
}

async function setIntercepters (page){

  await page.setRequestInterception(true);
  
  page.on('request',request => {
    var url = request.url()
    /* Find the best match */
    // console.log(path.basename(url))
    var redirector = Redirects.find(redirect => redirect.isMatch(url))
    /* If there was a match */
    if(redirector){
      var resourcepath = redirector.getPath(url)
      try {
        request.respond({
          headers: request.headers(),
          body: fs.readFileSync(resourcepath)
        })
      } catch(e){
        request.respond({
          status:'404',
          contentType:'text/plain',
          body:`${resourcepath} does not exist`
        })
      }
    } else {
      request.continue()
    }
  })
}

const puppeteerHandler = require('./puppeteerHandler')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')


let browser,page

/* Handle opening and closing the browser */
beforeAll(async () => {
  browser = await puppeteerHandler.open({ headless:true });
  [ page ] = await browser.pages();

  await page.exposeFunction('onLoader',async () => {
    Catcher.emit('set')
    await page.evaluate()
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(window,'ByuiThemeLoader',{
      get(){
        this._byuiloader
      },
      set(_){
        this._byuiloader = _
        this.onLoader()
      }
    })
  })

})
afterAll(() => browser.close())

/* Test the homepage menu */
describe('homepage',async () => {

  beforeAll(async () => {
    
    await page.goto('https://byui.instructure.com/courses/92')

    // Catcher.once('set',async () => {

    //   await page.evaluate
    //   jest.spyOn(loader.actions.Carousels.run)
    // })

  })

  test('loaded',() => {

    await page.evaluate(expect => {
      window.ByuiThemeLoader
    },expect)


    // expect(loader.actions.Carousels.run).toHaveBeenCalled()
  })

  // test('found onload',async () => {
  //   const ByuiThemeLoader = await page.evaluateHandle(() => window.ByuiThemeLoader)
  //   expect(ByuiThemeLoader.onload).toBeCalled()
  // })

})
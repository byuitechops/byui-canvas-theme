const puppeteerHandler = require('./puppeteerHandler')
const fs = require('fs')
const path = require('path')

const readFile = filename => fs.readFileSync(path.join(__dirname,filename),'utf-8')

let browser,page

const evaluate = (...args) => () => page.evaluate(...args)

jest.setTimeout(15000)

const DEBUGGING = false

/* Handle opening and closing the browser */
beforeAll(async () => {
  browser = await puppeteerHandler.open({ headless:!DEBUGGING });
  [ page ] = await browser.pages();


  await page.setRequestInterception(true)
  page.on('request',request => {
    if(path.basename(request.url()) == 'byui.js'){
      request.abort('blockedbyclient')
    } else {
      request.continue()
    }
  })

  page.on('load',() => page.evaluate(readFile('../src/byui.js')))
  await page.evaluateOnNewDocument(readFile('../node_modules/sinon/pkg/sinon.js'))
  await page.evaluateOnNewDocument(readFile('./expect.min.js'))

})
!DEBUGGING && afterAll(() => browser.close())

/* Test the homepage menu */
describe('homepage',async () => {

  var actions = ['CopyrightFooter','Homepage.Tutorial','Homepage.Start','Homepage.Lessons','Homepage.Resources','Homepage.Instructor']

  beforeAll(() => page.goto('https://byui.instructure.com/courses/92'))

  test('ThemeLoader exists on page',evaluate(() => {
    expect(window.ByuiThemeLoader).toBeTruthy()
  }))

  describe('Actions are present',async () => {
    actions.forEach(action => {
      test(action+' got wrapped',evaluate(action => {
        expect(window.ByuiThemeLoader.actions[action]).toBeTruthy()
        sinon.spy(ByuiThemeLoader.actions[action],'run')
      },action))
    })
  })

  test('ThemeLoader successfully ran',async () => {
    await page.evaluate(() => ByuiThemeLoader.onload())
    // await page.waitForNavigation({waitUntil:'networkidle0'})
    await page.waitForFunction(function(){
      return Object.values(ByuiThemeLoader.resources).every(n => n._readyState != 'loading')
    },{polling:'mutation'})
  })

  // test('Actions are present',evaluate(actions => {
  //   actions.forEach(action => {
  //     expect(window.ByuiThemeLoader.actions[action]).toBeTruthy()
  //     sinon.spy(ByuiThemeLoader.actions[action],'run')
  //   })
  // },actions))

  describe('Testing actions',() => {
    actions.forEach(action => {
      test(action+' successfully ran',evaluate(action => {
        expect(ByuiThemeLoader.actions[action].run.called).toBeTruthy()
        expect(ByuiThemeLoader.actions[action].run.threw()).toBeFalsy()
      },action))
    })
  })

})
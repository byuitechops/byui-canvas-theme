const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Enquirer = require('enquirer')
const https = require('https')
const puppeteer = require('puppeteer')
const enquirer = new Enquirer()
enquirer.register('password',require('prompt-password'))
enquirer.register('confirm',require('prompt-confirm'))
enquirer.question('username','username:')
enquirer.question('password','password:',{type:'password'})
enquirer.question('save','Would you like to save credentials to auth.json?',{type:'confirm'})

const authfile = path.resolve(__dirname,'auth.json')
const cookiefile = path.resolve(__dirname,'.cookie')

function readAuth(){
  try {
    auth = JSON.parse(fs.readFileSync(authfile,'utf-8'))
    assert(auth.username)
    assert(auth.password)
    return auth
  } catch(e){
    return false
  }
}

function testCookies(cookies){
  return new Promise((resolve,reject) => https.request({
    hostname:'byui.instructure.com',
    port:'443',
    method:'HEAD',
    headers:{ cookie:cookies.map(({name,value}) => name+'='+value).join('; ') }
  }, res => {
    res.statusCode == 200 ? resolve() : reject()
  }).end())
}

async function login(page){
  const loginpage = 'https://byui.instructure.com/login/canvas'
  let auth, authFromPrompt = false
  const set = (elm,value) => elm.value = value
  const promptAuth = () => enquirer
    .prompt(['username','password'])
    .then(answers => {
      authFromPrompt = true;
      auth = answers;
    })
  
  /* Go to login page */
  await page.goto(loginpage)

  /* Read creds from file */
  auth = readAuth()

  /* If not saved to a file, prompt for creds */
  if(!auth) await promptAuth()

  /* While we haven't gotten logged in */
  while(page.url() == loginpage) {
    
    /* Set username and password */
    await page.$eval('#pseudonym_session_unique_id',set,auth.username)
    await page.$eval('#pseudonym_session_password' ,set,auth.password)
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ])

    if(page.url() == loginpage) {
      /* If credentials didn't work */
      console.warn('Credentials Failed')
      // don't force them to type username again
      enquirer.get('username').default = auth.username 
      await promptAuth()
    } else if(authFromPrompt){
      /* Credentials worked, so ask if they would like to save them */
      await enquirer.ask('save').then(({save}) => {
        if(save){
          fs.writeFileSync(authfile,JSON.stringify({
            username:auth.username || "",
            password:auth.password || ""
          },null,4))
          authFromPrompt = false
        }
      })
    }
  }
  /* 
    If they are okay with storing creds in file 
    probably won't mind storing cookies in a file
    to speed things up even more
  */
  if(!authFromPrompt){
    var cookies = await page.cookies()
    cookies = cookies.filter(cookie => cookie.name == 'canvas_session')
    fs.writeFileSync(cookiefile,JSON.stringify(cookies))
  }
}

module.exports = async function(){

  const browser = await puppeteer.launch({headless:false})
  
  const page = await browser.newPage()

  try {
    var cookies = JSON.parse(fs.readFileSync(cookiefile,'utf-8'))
    await testCookies(cookies)
    await page.setCookie(...cookies)
  } catch(e){
    await login(page)
  }

  return [browser,page]
}
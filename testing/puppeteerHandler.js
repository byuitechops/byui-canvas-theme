const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Enquirer = require('enquirer')
const https = require('https')
const puppeteer = require('puppeteer')
const enquirer = new Enquirer()
const os = require('os')
const mkdirp = require('mkdirp')
enquirer.register('password',require('prompt-password'))
enquirer.register('confirm',require('prompt-confirm'))
enquirer.question('username','username:')
enquirer.question('password','password:',{type:'password'})
enquirer.question('save','Would you like to save credentials to auth.json?',{type:'confirm'})

const authfile = path.resolve(__dirname,'auth.json')
const cookiefile = path.resolve(__dirname,'.cookie')
const Redirects = []

/* Set userDataDir for settings to be saved */
const userDataDir = path.join(os.tmpdir(),'testing-user-data')
mkdirp.sync(userDataDir)
puppeteer.defaultArgs({
  args:[
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list'
  ],
  userDataDir
})

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
    const pagechange = page.waitForNavigation()
    await page.$eval('#pseudonym_session_unique_id',set,auth.username)
    await page.$eval('#pseudonym_session_password' ,set,auth.password)
    await page.click('button[type="submit"]')
    await pagechange

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
        console.log('>',resourcepath)
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

module.exports.redirect = function (match,filepath){
  var isMatch,getPath

  if(match.test != undefined){
    isMatch = url => match.test(url)
  } else if(typeof match == 'string'){
    isMatch = url => url.endsWith(match)
  } else {
    console.error(match)
    throw new Error('Redirect must have \'url\' property')
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

module.exports.open = async function(settings={}){

  /* Always ignore HTTPSErrors */
  settings.ignoreHTTPSErrors = true

  const browser = await puppeteer.launch(settings)
  
  const [ page ] = await browser.pages()

  try {
    var cookies = JSON.parse(fs.readFileSync(cookiefile,'utf-8'))
    await testCookies(cookies)
    await page.setCookie(...cookies)
    await page.goto('https://byui.instructure.com')
  } catch(e){
    await login(page)
  }

  /* 
    Gotcha Warning: redirects must be applied after the page has already 
      succesfully loaded to avoid HTTPS certificate errors. You can recognize
      these by the resource timing out and the entire page going blank after
      a couple of seconds after navigation
  */
  await setIntercepters(page).catch(console.error)

  return browser
}
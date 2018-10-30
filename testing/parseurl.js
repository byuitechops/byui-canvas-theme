// import { createRule, matchPattern } from 'https://unpkg.com/typed-url-matcher@0.2.4/modules/index'

// const Match = require('url-match-patterns').default
// const { createRule, matchPattern } = require('typed-url-matcher/lib/index.js')
// console.log(require('typed-url-matcher/lib/index.js'))

const Fuzzyurl = require('fuzzyurl')

// var fuzz = Fuzzyurl.fromString('/hello')
// console.log(fuzz)
// var mask = Fuzzyurl.mask(fuzz)

// var masks = ["/foo/*", "/foo/bar","*.instructure.com/*/byui.*"]

// console.log(Fuzzyurl.bestMatch(masks,'https://byui.instructure.com/byui.js'))

console.log(Fuzzyurl.fromString("*.instructure.com/**/byui.*"))

// var redirects = {
//   "*.*/hello":'file/path'
// }

// function creatematcher(template,str){
//   if(!str.includes('://')) str = '*://'+str
//   return tempate(str)
// }
// var ipRegex = require('ip-regex')

// const protocol = `(?:(?:([a-z]+|\\*):)?//)?`;
// const auth = '(?:(\\S+(?::\\S*)?)@)?';
// const ip = ipRegex.v4().source;
// const host = '((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
// const domain = '(?:\\.((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*)';
// const tld = `(?:\\.((?:[a-z\\u00a1-\\uffff]{2,}))\\.?)`;
// const port = '(?::(\\d{2,5}))?';
// const path = '([/?#][^\\s"]*)?';
// const regex = `(?:${protocol}|www\\.)${auth}(localhost|${ip}|${host}${domain}${tld}|\\*)${port}${path}`;

// console.log(`^${regex}$`)

// function createRegex(){
//   const protocol = `(?:(?:([a-z]+|\\*):)?//)?`;
//   const host = '(?:((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+|\\*)\\.)?';
//   const domain = '(?:((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*)';
//   const tld = `(?:\\.((?:[a-z\\u00a1-\\uffff]{2,}))\\.?)`;
//   const port = '(?::(\\d{2,5}))?';
//   const path = '([/?#][^\\s"]*)?';
//   const regex = `^(?:${protocol}|www\\.)(localhost|${host}${domain}${tld}|\\*)${port}${path}$`;
//   return new RegExp(regex)
// }

// function createRegex(){
//   const protocol = `(?:(?:([a-z]+|\\*):)?//)?`;
//   const host = '(?:((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+|\\*)\\.)?';
//   const domain = '(?:((?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*)';
//   const tld = `(?:\\.((?:[a-z\\u00a1-\\uffff]{2,}))\\.?)`;
//   const port = '(?::(\\d{2,5}))?';
//   const regex = `((?:${protocol}|www\\.)(localhost|${host}${domain}${tld}|\\*)${port})`;
//   return new RegExp(regex)
// }

// var domainRule = createRule({
//   regex:createRegex(),
//   convert(v){
//     console.log('convert',v)
//     return v
//   },
//   validate(){
//     console.log('validate',arguments)
//     return true
//   }
// })

// var route = {
//   pattern:':domain/**/byui.*',
//   rules: {
//     domain: domainRule
//   }
// }

// var match = matchPattern(route,'https://byui.instructure.com/path/to/file.html')
// console.log(match)

/*
 protocol: $1\n domain: $2\n subdomain: $3\n host: $4\n tld: $5\n port: $6\n path: $7
*/
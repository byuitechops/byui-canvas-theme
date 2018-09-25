function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}'true'===localStorage.getItem('devAccount')?console.warn('byui.js disabled for testing'):(window.onload=editorStyles,document.addEventListener('DOMContentLoaded',main));function editorStyles(){try{if('undefined'==typeof tinyMCE)return;var a=[/byui\.css$/,/online\.css$/,/common[\w-]*\.css$/,/variables[\w-]*\.css$/,/campus\.css$/,/pathway\.css$/],b=[].concat(_toConsumableArray(document.querySelectorAll('link[rel=stylesheet]'))).reduce(function(b,c){var d=c.getAttribute('href');return a.some(function(a){return null!==d.match(a)})&&b.push(d),b},[]);tinyMCE.editors.forEach(function(a){b.forEach(function(b){a.dom.styleSheetLoader.load(b)})})}catch(a){console.error(a)}}function main(){var a=document.location.pathname.split('/')[2];(function(){try{$('div.accordion').accordion({heightStyle:'content',collapsible:!0,active:!1})}catch(a){console.error(a)}})(),function(){try{$('#styleguide-tabs-demo-minimal').tabs()}catch(a){console.error(a)}}(),function(){try{for(var a=document.querySelectorAll('.byui-video'),b=0;b<a.length;b++)'youtube'==a[b].dataset.source?a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://www.youtube.com/embed/'+a[b].dataset.vidid+'" frameborder="0" allowfullscreen></iframe>':'kaltura'==a[b].dataset.source&&(a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id='+a[b].dataset.vidid+'&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')}catch(a){console.error(a)}}(),function(){function b(b){try{var c=b.find(function(a){return /student\s*resources/i.test(a.name)}),d=document.querySelector('#start'),e=document.querySelector('#tutorial'),f=document.querySelector('#resources'),g=document.querySelector('#instructor');d&&(d.href='/courses/'+a+'/modules#module_'+b[0].id),e&&(e.href='http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw'),f&&c&&(f.href='/courses/'+a+'/modules#module_'+c.id),$.get('https://byui.instructure.com/api/v1/courses/'+a+'/enrollments?type%5B%5D=TeacherEnrollment&per_page=50',function(b){b=b.filter(function(a,b,c){return c.findIndex(function(b){return b.user_id==a.user_id})==b}),1<b.length?console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.'):0===b.length?console.log('Unable to find teacher enrollment.'):g.href='/courses/'+a+'/users/'+b[0].user_id})}catch(a){console.error(a)}}function c(b){try{function f(b,d){d++,10>d&&(d='0'+d),document.querySelector(c).insertAdjacentHTML('beforeend','<a href=\'/courses/'+a+'/modules#module_'+b+'\' style=\'width: calc(100% / '+e+' - 20px);\'>'+d+'</a>')}var c='#navigation .lessons';if([].concat(_toConsumableArray(document.querySelector('#navigation .lessons').classList)).includes('generate')){document.querySelector('#navigation .lessons').innerHTML='';var d=b.filter(function(a){return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)}),e=7<d.length?7:d.length;d.forEach(function(a,b){f(a.id,b)})}}catch(a){console.error(a)}}try{var d=0<document.querySelectorAll('#navigation .steps').length,e=0<document.querySelectorAll('#navigation .lessons').length;if(!d||!e)return;$.get('/api/v1/courses/'+a+'/modules?per_page=30',function(a){d&&b(a),e&&c(a)})}catch(a){console.error(a)}}(),function(){try{4===document.querySelectorAll('#breadcrumbs li').length&&/\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)&&(document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML='Modules',document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href=document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i,'/modules'))}catch(a){console.error(a)}}(),function(){try{var a=document.querySelector('pre code');if(null==a)return;var b=document.createElement('script'),c=document.createElement('link');b.src='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js',c.href='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css',c.rel='stylesheet',document.head.appendChild(b),document.head.appendChild(c)}catch(a){console.error(a)}}(),function(){try{var a=document.getElementById('content');if(a)document.querySelector('p.copyright')||document.querySelector('p#byui-copyright')||a.insertAdjacentHTML('beforeend','<p id=\'byui-copyright\'>Copyright '+new Date().getFullYear()+' Brigham Young University-Idaho</p>');else throw new Error('unable to add copyright footer to page')}catch(a){console.error(a)}}(),function(){var a='black',b=window.location.href.includes('settings'),c=window.location.href.includes('assignments');if(b||c){var d=document.createElement('div');d.setAttribute('id','byui-quizzes-next-tooltip'),d.setAttribute('style','display:none'),d.innerHTML='<div>Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features/div>',b&&(a='red',d.innerHTML='<div>Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>');var e=document.createElement('style');e.innerHTML='\n    .tippy-tooltip.byui-theme {\n        border: 2px solid '+a+';\n        background-color: white;\n        color: black;\n        max-width: 200px;\n      }\n      .tippy-backdrop {\n        background: white;\n      }';var f=document.createElement('script');f.type='text/javascript',f.async=!0,f.onload=function(){tippy('.quizzes_next, .new_quiz_lti_wrapper',{html:'#byui-quizzes-next-tooltip',interactive:!0,placement:'bottom-end',theme:'byui',size:'large'})},f.src='https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js',document.body.appendChild(d),document.head.appendChild(e),document.head.appendChild(f)}}()}
//# sourceMappingURL=byui.js.map

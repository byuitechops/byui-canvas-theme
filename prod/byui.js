function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}'true'===localStorage.getItem('devAccount')?console.warn('byui.js disabled for testing'):(window.onload=onloadFunctions,document.addEventListener('DOMContentLoaded',main));function checkForJquery(){function a(){console.log('loading jQuery');var a=document.createElement('script');a.href='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',document.head.appendChild(a)}try{if('undefined'==typeof $||'undefined'==typeof $().jquery)a();else{for(var b=['1','7','0'],c=$().jquery.split('.'),d=!0,e=0;e<b.length&&!(c[e]>b[e]);e++)if(c<b){d=!1;break}d||a()}}catch(a){console.error(a)}}function onloadFunctions(){(function(){try{document.querySelector('.carousel')&&(checkForJquery(),$('.carousel').slick({dots:!0}))}catch(a){console.error(a)}})(),function(){try{if('undefined'==typeof tinyMCE)return;var a=[/byui\.css$/,/online\.css$/,/common[\w-]*\.css$/,/variables[\w-]*\.css$/,/campus\.css$/,/pathway\.css$/],b=[].concat(_toConsumableArray(document.querySelectorAll('link[rel=stylesheet]'))).reduce(function(b,c){var d=c.getAttribute('href');return a.some(function(a){return null!==d.match(a)})&&b.push(d),b},[]);tinyMCE.editors.forEach(function(a){b.forEach(function(b){a.dom.styleSheetLoader.load(b)})})}catch(a){console.error(a)}}()}function main(){var a=document.location.pathname.split('/')[2];(function(){try{document.querySelector('div.accordion')&&(checkForJquery(),$('div.accordion').accordion({heightStyle:'content',collapsible:!0,active:!1}))}catch(a){console.error(a)}})(),function(){try{document.querySelector('#styleguide-tabs-demo-minimal')&&(checkForJquery(),$('#styleguide-tabs-demo-minimal').tabs())}catch(a){console.error(a)}}(),function(){try{document.querySelector('div.dialog')&&(checkForJquery(),$('div.dialog').dialog())}catch(a){console.error(a)}}(),function(){try{for(var a=document.querySelectorAll('.byui-video'),b=0;b<a.length;b++)'youtube'==a[b].dataset.source?a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://www.youtube.com/embed/'+a[b].dataset.vidid+'" frameborder="0" allowfullscreen></iframe>':'kaltura'==a[b].dataset.source&&(a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id='+a[b].dataset.vidid+'&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')}catch(a){console.error(a)}}(),function(){function b(b){try{var c=b.find(function(a){return /student\s*resources/i.test(a.name)}),d=document.querySelector('#start'),e=document.querySelector('#tutorial'),f=document.querySelector('#resources'),g=document.querySelector('#instructor');d&&(d.href='/courses/'+a+'/modules#module_'+b[0].id),e&&(e.href='http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw'),f&&c&&(f.href='/courses/'+a+'/modules#module_'+c.id),$.get('https://byui.instructure.com/api/v1/courses/'+a+'/enrollments?type%5B%5D=TeacherEnrollment&per_page=50',function(b){b=b.filter(function(a,b,c){return c.findIndex(function(b){return b.user_id==a.user_id})==b}),1<b.length?console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.'):0===b.length?console.log('Unable to find teacher enrollment.'):g.href='/courses/'+a+'/users/'+b[0].user_id})}catch(a){console.error(a)}}function c(b){try{function f(b,d){d++,10>d&&(d='0'+d),document.querySelector(c).insertAdjacentHTML('beforeend','<a href=\'/courses/'+a+'/modules#module_'+b+'\' style=\'width: calc(100% / '+e+' - 20px);\'>'+d+'</a>')}var c='#navigation .lessons';if([].concat(_toConsumableArray(document.querySelector('#navigation .lessons').classList)).includes('generate')){document.querySelector('#navigation .lessons').innerHTML='';var d=b.filter(function(a){return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)}),e=7<d.length?7:d.length;d.forEach(function(a,b){f(a.id,b)})}}catch(a){console.error(a)}}try{var d=0<document.querySelectorAll('#navigation .steps').length,e=0<document.querySelectorAll('#navigation .lessons').length;if(!d||!e)return;checkForJquery(),$.get('/api/v1/courses/'+a+'/modules?per_page=30',function(a){d&&b(a),e&&c(a)})}catch(a){console.error(a)}}(),function(){try{4===document.querySelectorAll('#breadcrumbs li').length&&/\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)&&(document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML='Modules',document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href=document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i,'/modules'))}catch(a){console.error(a)}}(),function(){try{var a=document.querySelector('pre code');if(null==a)return;var b=document.createElement('script'),c=document.createElement('link');b.src='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js',c.href='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css',c.rel='stylesheet',document.head.appendChild(b),document.head.appendChild(c)}catch(a){console.error(a)}}(),function(){try{var a=document.getElementById('content');if(a)document.querySelector('p.copyright')||document.querySelector('p#byui-copyright')||a.insertAdjacentHTML('beforeend','<p id=\'byui-copyright\'>Copyright '+new Date().getFullYear()+' Brigham Young University-Idaho</p>');else throw new Error('unable to add copyright footer to page')}catch(a){console.error(a)}}(),function(){try{var a='black';if(window.location.href.includes('settings'))document.head.insertAdjacentHTML('beforeend','<div id="byui-quizzes-next-tooltip" style="display: none;">Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>'),a='red';else if(window.location.href.includes('assignments'))document.head.insertAdjacentHTML('beforeend','<div id="byui-quizzes-next-tooltip" style="display: none;">Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features/div>');else return;var b='<style>.tippy-tooltip.byui-theme {border: 2px solid '+a+';background-color: white;color: black;max-width: 200px;}.tippy-backdrop {background: white;}</style>';document.head.insertAdjacentHTML('beforeend',b);var c=document.createElement('script');c.type='text/javascript',c.async=!0,c.src='https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js',c.onload=function(){tippy('.quizzes_next, .new_quiz_lti_wrapper',{html:'#byui-quizzes-next-tooltip',interactive:!0,placement:'bottom-end',theme:'byui',size:'large'})},document.head.appendChild(c)}catch(a){console.error(a)}}(),function(){try{if(0===document.querySelector('.carousel').length)return;var a=document.createElement('script');a.src='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js',document.head.appendChild(a);var b=document.createElement('link');b.href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css',b.rel='stylesheet',document.head.appendChild(b);var c=document.createElement('link');c.href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css',c.rel='stylesheet',document.head.appendChild(c)}catch(a){console.error(a)}}()}
//# sourceMappingURL=byui.js.map

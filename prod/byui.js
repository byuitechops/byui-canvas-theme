function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}'true'===localStorage.getItem('devAccount')?console.warn('byui.js disabled for testing'):(window.onload=editorStyles,document.addEventListener('DOMContentLoaded',main));function editorStyles(){try{if('undefined'==typeof tinyMCE)return;var a=[/byui\.css$/,/online\.css$/,/common[\w-]*\.css$/,/variables[\w-]*\.css$/,/campus\.css$/,/pathway\.css$/],b=[].concat(_toConsumableArray(document.querySelectorAll('link[rel=stylesheet]'))).reduce(function(b,c){var d=c.getAttribute('href');return a.some(function(a){return null!==d.match(a)})&&b.push(d),b},[]);tinyMCE.editors.forEach(function(a){b.forEach(function(b){a.dom.styleSheetLoader.load(b)})})}catch(a){console.error(a)}}function main(){var a=document.location.pathname.split('/')[2];(function(){try{$('div.accordion').accordion({heightStyle:'content',collapsible:!0,active:!1})}catch(a){console.error(a)}})(),function(){try{$('#styleguide-tabs-demo-minimal').tabs()}catch(a){console.error(a)}}(),function(){try{for(var a=document.querySelectorAll('.byui-video'),b=0;b<a.length;b++)'youtube'==a[b].dataset.source?a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://www.youtube.com/embed/'+a[b].dataset.vidid+'" frameborder="0" allowfullscreen></iframe>':'kaltura'==a[b].dataset.source&&(a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id='+a[b].dataset.vidid+'&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')}catch(a){console.error(a)}}(),function(){function b(b){try{$.get('https://byui.instructure.com/api/v1/courses/'+a+'/enrollments?type%5B%5D=TeacherEnrollment',function(b){b=b.map(function(a){return a.user_id}).filter(function(a,b,c){return c.indexOf(a)===b}),1<b.length?console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.'):0===b.length?console.log('Unable to find teacher enrollment.'):instructor.href='/courses/'+a+'/users/'+b[0]});var c=b.find(function(a){return /student\s*resources/i.test(a.name)}),d=document.querySelector('#start'),e=document.querySelector('#tutorial'),f=document.querySelector('#resources');d&&(d.href='/courses/'+a+'/modules#module_'+b[0].id),e&&(e.href='http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw'),f&&c&&(f.href='/courses/'+a+'/modules#module_'+c.id)}catch(a){console.error(a)}}function c(b){try{var c=function(b,c){c++,10>c&&(c='0'+c),document.querySelector('#navigation .lessons').insertAdjacentHTML('beforeend','<a href=\'/courses/'+a+'/modules#module_'+b+'\' style=\'width: calc(100% / '+e+' - 20px);\'>'+c+'</a>')};if([].concat(_toConsumableArray(document.querySelector('#navigation .lessons').classList)).includes('generate')){document.querySelector('#navigation .lessons').innerHTML='';var d=b.filter(function(a){return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)}),e=7<d.length?7:d.length;d.forEach(function(a,b){c(a.id,b)})}}catch(a){console.error(a)}}try{if(0===document.querySelectorAll('#navigation .steps, #navigation .lessons').length)return;$.get('/api/v1/courses/'+a+'/modules?per_page=30',function(a){b(a),c(a)})}catch(a){console.error(a)}}(),function(){try{4===document.querySelectorAll('#breadcrumbs li').length&&/\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)&&(document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML='Modules',document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href=document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i,'/modules'))}catch(a){console.error(a)}}(),function(){try{var a=document.querySelector('pre code');if(null==a)return;var b=document.createElement('script'),c=document.createElement('link');b.src='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js',c.href='https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css',c.rel='stylesheet',document.head.appendChild(b),document.head.appendChild(c)}catch(a){console.error(a)}}(),function(){try{var a=document.getElementById('content');if(a)document.querySelector('p.copyright')||document.querySelector('p#byui-copyright')||a.insertAdjacentHTML('beforeend','<p id=\'byui-copyright\'>Copyright '+new Date().getFullYear()+' Brigham Young University-Idaho</p>');else throw new Error('unable to add copyright footer to page')}catch(a){console.error(a)}}(),function(){var a='black',b=window.location.href.includes('settings');if(b||window.location.href.includes('assignments')){var c=document.createElement('div');c.setAttribute('id','byui-quizzes-next-tooltip'),c.setAttribute('style','display:none'),c.innerHTML='<div>Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features/div>',b&&(a='red',c.innerHTML='<div>Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>');var d=document.createElement('style');d.innerHTML='\n    .tippy-tooltip.honeybee-theme {\n        border: 2px solid '+a+';\n        background-color: white;\n        color: black;\n        max-width: 200px;\n      }\n      .tippy-backdrop {\n        background: white;\n      }';var e=document.createElement('script');e.type='text/javascript',e.async=!0,e.onload=function(){tippy('.quizzes_next, .new_quiz_lti_wrapper',{html:'#byui-quizzes-next-tooltip',interactive:!0,placement:'bottom-end',theme:'honeybee',size:'large'})},e.src='https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js',document.body.appendChild(c),document.head.appendChild(d),document.head.appendChild(e)}}()}
//# sourceMappingURL=byui.js.map

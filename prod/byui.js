/*v 1.1.0*/(function(){function a(a){try{a()}catch(a){console.error(a)}}function b(a,b){if(null===document.querySelector('script[src="'+a+'"]')){var c=document.createElement('script');c.src=a,b&&c.addEventListener('load',b,{once:!0}),document.head.appendChild(c)}}function c(a,b){if(null===document.querySelector('link[href="'+a+'"]')){var c=document.createElement('link');c.rel='stylesheet',c.type='text/css',c.href=a,b&&script.addEventListener('load',b,{once:!0}),document.head.appendChild(c)}}function d(a){function c(a,b){if(a.length!=b.length)throw new Error('Comparing two different sizes');for(var c=0;c<a.length;c++){if(a[c]>b[c])return!1;if(a[c]<b[c])return!0}return!1}if(this.jQuery)return a(this.jQuery);var d=!0;if('undefined'!=typeof jQuery||'undefined'!=typeof jQuery().jquery){var e=jQuery().jquery.split('.');d=c(e,[1,7,0])}d?b('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',function(){this.jQuery=jQuery.noConflict(),a(this.jQuery)}):(this.jQuery=jQuery,a(jQuery))}function e(){document.querySelector('.byui .carousel')&&d(function(a){a('.byui .carousel').slick({dots:!0})})}function f(){if('undefined'!=typeof tinyMCE){var a=[/byui\.css$/,/online\.css$/,/common[\w-]*\.css$/,/variables[\w-]*\.css$/,/campus\.css$/,/pathway\.css$/],b=[];document.querySelectorAll('link[rel=stylesheet]').forEach(function(c){var d=c.getAttribute('href');a.some(function(a){return null!==d.match(a)})&&b.push(d)}),tinyMCE.editors.forEach(function(a){b.forEach(function(b){a.dom.styleSheetLoader.load(b)})})}}function g(){document.querySelector('.byui div.accordion')&&d(function(a){a('.byui div.accordion').accordion({heightStyle:'content',collapsible:!0,active:!1})})}function h(){document.querySelector('.byui div.dialog')&&document.querySelectorAll('.byui .Button[id^=\'link_\']').forEach(function(a){var b=/link_(\d+)/i.exec(a.id)[1],c=$('.byui #dialog_for_link_'+b);c.dialog({autoOpen:!1}),a.addEventListener('click',function(a){a.preventDefault(),c.dialog('open')})})}function i(){document.querySelectorAll('.byui-video').forEach(function(a){'youtube'==a.dataset.source?a.innerHTML='<iframe width="'+a.dataset.width+'px" height="'+a.dataset.height+'px" src="https://www.youtube.com/embed/'+a.dataset.vidid+'" frameborder="0" allowfullscreen></iframe>':'kaltura'==a.dataset.source&&(a.innerHTML='<iframe width="'+a.dataset.width+'px" height="'+a.dataset.height+'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id='+a.dataset.vidid+'&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')})}function j(a,b){var c=b.find(function(a){return /student\s*resources/i.test(a.name)}),e=document.querySelector('.byui #start'),f=document.querySelector('.byui #tutorial'),g=document.querySelector('.byui #resources'),h=document.querySelector('.byui #instructor');e&&(e.href='/courses/'+a+'/modules#module_'+b[0].id),f&&(f.href='http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation'),g&&c&&(g.href='/courses/'+a+'/modules#module_'+c.id),d(function(b){b.get('https://byui.instructure.com/api/v1/courses/'+a+'/enrollments?type%5B%5D=TeacherEnrollment&per_page=50',function(b){b=b.filter(function(a,b,c){return c.findIndex(function(b){return b.user_id==a.user_id})==b}),1<b.length?console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.'):0===b.length?console.log('Unable to find teacher enrollment.'):h.href='/courses/'+a+'/users/'+b[0].user_id})})}function k(a,b){var c=document.querySelector('.byui #navigation .lessons');if(c.classList.contains('generate')){c.innerHTML='';var d=b.filter(function(a){return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)}),e=7<d.length?7:d.length;d.forEach(function(b,d){var f=(9>d?'0':'')+(d+1);c.insertAdjacentHTML('beforeend','<a href=\'/courses/'+a+'/modules#module_'+b.id+'\' style=\'width: calc(100% / '+e+' - 20px);\'>'+f+'</a>')})}}function l(){var a=document.querySelector('.byui #navigation .steps'),b=document.querySelector('.byui #navigation .lessons');if(a&&b){var c=document.location.pathname.split('/')[2];d(function(d){d.get('/api/v1/courses/'+c+'/modules?per_page=30',function(d){a&&j(c,d),b&&k(c,d)})})}}function m(){if(4===document.querySelectorAll('#breadcrumbs li').length&&/\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)){document.querySelector('#breadcrumbs li:nth-child(3) span').innerHTML='Modules';var a=document.querySelector('#breadcrumbs li:nth-child(3) a');a.href=a.href.replace(/\/\w+$/i,'/modules')}}function n(){document.querySelector('pre code')&&(b('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js'),c('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css'))}function o(){var a=document.getElementById('content');a?!document.querySelector('p.copyright')&&!document.querySelector('p#byui-copyright')&&!window.location.pathname.includes('speed_grader')&&a.insertAdjacentHTML('beforeend','<p id=\'byui-copyright\'>Copyright '+new Date().getFullYear()+' Brigham Young University-Idaho</p>'):console.warn('unable to add copyright footer to page')}function p(){var a='',c='black';if(window.location.href.includes('settings'))a='Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next',c='red';else if(window.location.href.includes('assignments'))a=a='Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features';else return;document.head.insertAdjacentHTML('beforeend','<div id="byui-quizzes-next-tooltip" style="display: none;">'+a+'</div>'),document.head.insertAdjacentHTML('beforeend','\n        <style>\n            .tippy-tooltip.byui-theme {\n                border: 2px solid '+c+';\n                background-color: white;\n                color: black;\n                max-width: 200px;\n            }\n            .tippy-backdrop {\n                background: white;\n            }\n        </style>\n    '),b('https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js',function(){tippy('.quizzes_next, .new_quiz_lti_wrapper',{html:'#byui-quizzes-next-tooltip',interactive:!0,placement:'bottom-end',theme:'byui',size:'large'})})}function q(){document.querySelector('.byui .carousel')&&(b('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js'),c('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css'),c('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css'))}function r(){d(function(a){a('.byui #styleguide-tabs-demo-minimal').tabs()})}window.addEventListener('load',function(){a(e),a(f)}),document.addEventListener('DOMContentLoaded',function(){a(g),a(h),a(r),a(i),a(l),a(m),a(n),a(o),a(p),a(q)})})();
//# sourceMappingURL=byui.js.map

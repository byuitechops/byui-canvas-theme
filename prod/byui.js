'true'!==localStorage.getItem('devAccount')&&document.addEventListener('DOMContentLoaded',main);function main(){var a=document.location.pathname.split('/')[2];(function(){try{$('div.accordion').accordion({heightStyle:'content',collapsible:!0,active:!1})}catch(a){console.error(a)}})(),function(){try{$('#styleguide-tabs-demo-minimal').tabs()}catch(a){console.error(a)}}(),function(){try{for(var a=document.querySelectorAll('.byui-video'),b=0;b<a.length;b++)'youtube'==a[b].dataset.source?a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://www.youtube.com/embed/'+a[b].dataset.vidid+'" frameborder="0" allowfullscreen></iframe>':'kaltura'==a[b].dataset.source&&(a[b].innerHTML='<iframe width="'+a[b].dataset.width+'px" height="'+a[b].dataset.height+'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id='+a[b].dataset.vidid+'&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')}catch(a){console.error(a)}}(),function(){function b(){try{$.get('/api/v1/courses/'+a+'/modules?per_page=30',function(b){function c(b,c){var d=c+1;10>c+1&&(d='0'+(c+1)),document.querySelector('#navigation .lessons').insertAdjacentHTML('beforeend','<a href=\'/courses/'+a+'/modules#module_'+b+'\' style=\'width: calc(100% / '+j+' - 20px);\'>'+d+'</a>')}var f,h=0;if(Array.from(document.querySelector('#navigation .lessons').classList).includes('generate')){document.querySelector('#navigation .lessons').innerHTML='';var i=[];b.forEach(function(a){/(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)?i.push(a):/student\s*resources/i.test(a.name)&&(f=a.id)});var j=7<i.length?7:i.length;i.forEach(function(a){c(a.id,h),h++})}e&&(e.href='/courses/'+a+'/modules#module_'+b[0].id),d&&(d.href='http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw'),g&&(g.href='/courses/'+a+'/modules#module_'+f)})}catch(a){console.error(a)}}function c(){try{$.get('https://byui.instructure.com/api/v1/courses/'+a+'/enrollments?per_page=100',function(b){var c=b.filter(function(a){return'TeacherEnrollment'===a.type});if(1<c.length){var d=c[0].user_id,e=c.find(function(a){return a.user_id!==d})!=null;if(!0==e)return void console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.')}else if(0===c.length)return void console.log('Unable to find teacher enrollment.');f.href='/courses/'+a+'/users/'+c[0].user_id})}catch(a){console.error(a)}}if(0!==document.querySelectorAll('#navigation .steps').length){var d=document.querySelector('#tutorial'),e=document.querySelector('#start'),f=document.querySelector('#instructor'),g=document.querySelector('#resources');b(),c()}}(),function(){try{4===document.querySelectorAll('#breadcrumbs li').length&&/\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)&&(document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML='Modules',document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href=document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i,'/modules'))}catch(a){console.error(a)}}()}
//# sourceMappingURL=byui.js.map
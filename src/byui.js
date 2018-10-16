/* eslint-env browser */
/* eslint no-console:0 */
/* global tinyMCE, tippy */

(function(){ /* IFFY - nothing released into global */

/* Allows us to disable this page for testing purposes */
// TESTING disable for prod

if (localStorage.getItem('devAccount') !== 'true') {
    
    window.addEventListener('load',function(){
        run(initializeCarousel);
        run(editorStyles);
    });

    document.addEventListener('DOMContentLoaded',function(){
        run(initializeAccordion);
        run(initializeDialog);
        run(insertVideoTag);
        run(generateHomePage);
        run(alterBreadcrumb);
        run(prismHighlighting);
        run(addCopyrightFooter);
        run(addTooltips);
        run(loadSlickJS);
    });

} else {
    console.warn('byui.js disabled for testing');
}

function run(fn){ try { fn() } catch (e){ console.error(e) } }

function loadScript(href,cb){
    // Already injected?
    if(document.querySelector('script[src="'+href+'"]') === null){
        var script = document.createElement('script');
        script.src = href
        // Call the callback once it is done loading
        if(cb) script.addEventListener('load',cb,{once:true});
        // Append to head of document
        document.head.appendChild(script);
    }
}

function loadStyle(href,cb){
    // Already injected?
    if(document.querySelector('link[href="'+href+']"') === null){
        var link = document.createElement('link');
        link.ref = 'stylesheet';
        link.type = 'text/css';
        link.href = href
        // Call the callback once it is done loading
        if(cb) link.addEventListener('load',cb,{once:true});
        // Append to head of document
        document.head.appendChild(link);
    }
}

function getjQuery(cb) {
    /* If already saved then give that */
    if(this.jQuery) return cb(this.jQuery)

    function lessThan(A,B){
        if(A.length != B.length) throw new Error('Comparing two different sizes')
        for (i = 0; i < A.length; i++) {
            // Greater Than
            if (A[i] > B[i]) return false;
            // Less Than
            else if (A[i] < B[i]) return true;
        }
        // Equal
        return false
    }

    var needtoLoad = true;

    /* If jQuery is already on the page */
    if (typeof jQuery != 'undefined' && typeof jQuery().jquery != 'undefined') {
        // get the version
        var currentVersion = jQuery().jquery.split('.'), i;
        // check to see if version is above our minimum
        needtoLoad = lessThan(currentVersion,[1,7,0])
    }

    /* Load the script if needed */
    if(needtoLoad){
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',function(){
            this.jQuery = jQuery.noConflict()
            cb(this.jQuery);
        })
    } else {
        this.jQuery = jQuery
        cb(jQuery);
    }
}

/* Initialize carousels if any are present on page */
function initializeCarousel() {
    if (document.querySelector('.carousel')) {
        getjQuery($ => {
            $('.carousel').slick({
                dots: true,
            });
        });
    }
}

/* inject css into tinyMCE editors on page. Has to wait till tinyMCE is done loading */
function editorStyles() {
    /* if there are no WYSIWYG's on the page, don't bother running */
    if (typeof tinyMCE === 'undefined') return;

    /* our css, canvas common css, canvas color vars css */
    var cssNames = [/byui\.css$/, /online\.css$/, /common[\w-]*\.css$/, /variables[\w-]*\.css$/, /campus\.css$/, /pathway\.css$/];
    
    /* Collect list of hrefs that match one of the cssNames */
    var cssHrefs = []
    document.querySelectorAll('link[rel=stylesheet]').forEach(function(linkTag){
        var href = linkTag.getAttribute('href');
        /* only keep the link if it matches one of the regExes */
        if (cssNames.some(cssName => href.match(cssName) !== null)) {
            cssHrefs.push(href);
        }
    })

    /* For each editor, inject each stylesheet */
    tinyMCE.editors.forEach(editor => {
        cssHrefs.forEach(href => {
            editor.dom.styleSheetLoader.load(href);
        });
    });
}

/* Initialize accordion - JQUERY UI */
function initializeAccordion() {
    if (document.querySelector('div.accordion')) {
        getjQuery($ => {
            $('div.accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active: false
            });
        });
    }
}

/* Initialize dialog - JQUERY UI */
function initializeDialog() {
    if (document.querySelector('div.dialog')) {
        getjQuery($ => {
            $('div.dialog').dialog();
        });
    }
}

/* Insert custom video tag generation scripts */
function insertVideoTag() {
    document.querySelectorAll('.byui-video').forEach(video => {
        if (video.dataset.source == 'youtube') {
            video.innerHTML = `<iframe width="${video.dataset.width}px" height="${video.dataset.height}px" src="https://www.youtube.com/embed/${video.dataset.vidid}" frameborder="0" allowfullscreen></iframe>`;
        } else if (videos[i].dataset.source == 'kaltura') {
            video.innerHTML = `<iframe width="${video.dataset.width}px" height="${video.dataset.height}px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id=${video.dataset.vidid}&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>`;
        }
    })
}

/* generate top buttons (under.steps) */
function generateSteps(courseNumber,modules) {

    /* Get additional resources module item */
    var resourcesModule = modules.find(canvasModule => /student\s*resources/i.test(canvasModule.name));

    /* set home page buttons */
    var start = document.querySelector('#start'),
        iLearnTutorial = document.querySelector('#tutorial'),
        resources = document.querySelector('#resources'),
        instructor = document.querySelector('#instructor');

    if (start)
        start.href = `/courses/${courseNumber}/modules#module_${modules[0].id}`;
    if (iLearnTutorial)
        iLearnTutorial.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw';
    if (resources && resourcesModule)
        resources.href = `/courses/${courseNumber}/modules#module_${resourcesModule.id}`;

    getjQuery($ => {
        /* generate link to instructor bio - make the api call to get enrollments*/
        $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments?type%5B%5D=TeacherEnrollment`, teachers => {
            /* check for multiple instances of the same teacher */
            // TODO which one of these is faster?
            // teachers = teachers.map(teacher => teacher.user_id).filter((teacherId, i, teachers) => teachers.indexOf(teacherId) === i);
            teachers = teachers.filter((teacher, i, teachers) => teachers.findIndex(teach => teach.user_id == teacher.user_id) == i);
    
    
            if (teachers.length > 1) {
                /* If there are multiple unique teachers */
                console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.');
            } else if (teachers.length === 0) {
                /* if the teacher isn't enrolled for some reason */
                console.log('Unable to find teacher enrollment.');
            } else {
                /* if we have one teacher set the URL */
                instructor.href = `/courses/${courseNumber}/users/${teachers[0].user_id}`;
            }
        });
    })
}

/* generate lesson links (under .lessons) */
function generateLessons(courseNumber,modules) {
    var lessonWrapper = document.querySelector('#navigation .lessons')

    /* clear lesson div & generate module links if generate class exists */
    if (lessonWrapper.classList.contains('generate')) {
        
        /* Clear lesson wrapper */
        lessonWrapper.innerHTML = '';
        
        /* remove modules with invalid names & get modulesPerRow (limit 7) */
        var validModules = modules.filter(canvasModule => /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(canvasModule.name))
        var modulesPerRow = validModules.length > 7 ? 7 : validModules.length;

        /* generate module links */
        validModules.forEach((canvasModule, i) => {
            var moduleCount = (i < 10 ? '0':'') + (i+1)
            lessonWrapper.insertAdjacentHTML('beforeend', `<a href='/courses/${courseNumber}/modules#module_${canvasModule.id}' style='width: calc(100% / ${modulesPerRow} - 20px);'>${moduleCount}</a>`);
        });
    }
}

/* handles all functions required to generate the course homepage */
function generateHomePage() {
    
    /* if we are on the course homepage and the page has the expected format */
    var steps = document.querySelector('#navigation .steps')
    var lessons = document.querySelector('#navigation .lessons')
    if (steps && lessons) {
        
        var courseNumber = document.location.pathname.split('/')[2];
        
        /* get course modules */
        getjQuery($ => {
            $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', (modules) => {
                
                /* Don't run steps if they don't exist (or lessons) */
                if (steps) generateSteps(courseNumber,modules);
                if (lessons) generateLessons(courseNumber,modules);

            });
        })
    }
}

/* Hide the 3rd breadcrumb */
function alterBreadcrumb() {
    /* If there are 4 total, AND we're inside a course AND we're not in a group tab */
    if (document.querySelectorAll('#breadcrumbs li').length === 4 && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)) {
        
        document.querySelector('#breadcrumbs li:nth-child(3) span').innerHTML = 'Modules';
        
        /* update the link */
        var link = document.querySelector('#breadcrumbs li:nth-child(3) a')
        link.href = link.href.replace(/\/\w+$/i, '/modules');
    }
}

/* enable prism pre > code highlighting */
function prismHighlighting() {
    if (document.querySelector('pre code') == null){
        loadScript('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js')
        loadStyle('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css')
    }
}

/* Insert copyright footer */
function addCopyrightFooter() {
    var page = document.getElementById('content');
    if (page) {
        /* don't add one if it already exists */
        if (!document.querySelector('p.copyright') && !document.querySelector('p#byui-copyright')){
            page.insertAdjacentHTML('beforeend', `<p id='byui-copyright'>Copyright ${new Date().getFullYear()} Brigham Young University-Idaho</p>`);
        }
    } else {
        console.warn('unable to add copyright footer to page');
    }
}

/* add quiz.next tooltips where needed */
function addTooltips() {

    var tip, borderColor, divId = 'byui-quizzes-next-tooltip';

    /* Add appropriate tooltip OR return if we're on the wrong page */
    if (window.location.href.includes('settings')) {
        /* Settings Tip */
        borderColor = 'red';
        tip = 'Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next';
    } else if (window.location.href.includes('assignments')) {
        /* Assignments Tip */
        borderColor = 'black';
        tip = 'Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features';
    } else {
        return;
    }

    /* Inject the tooltip */
    document.head.insertAdjacentHTML('beforeend',`<div id="${divId}" style="display: none;">${tip}</div>`);

    /* Add tooltip styles to DOM with appropriate border color */
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .tippy-tooltip.byui-theme {
                border: 2px solid ${borderColor};
                background-color: white;
                color: black;
                max-width: 200px;
            }
            .tippy-backdrop {
                background: white;
            }
        </style>
    `)

    /* Load Tippy */
    loadScript('https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js',function(){
        tippy('.quizzes_next, .new_quiz_lti_wrapper', {
            html: '#'+divId,
            interactive: true,
            placement: 'bottom-end',
            theme: 'byui',
            size: 'large'
        });
    });
}

/* load JS & CSS needed for image carousels if there is one on the page */
function loadSlickJS() {
    if(document.querySelector('.carousel')){
        /* Script */
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js');
        /* Css */
        loadStyle('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css');
        /* Theme */
        loadStyle('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css');
    }
}

})()
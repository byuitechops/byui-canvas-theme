/*eslint-env node, browser, jquery*/
/* eslint no-console:0 */
/* global tinyMCE */

/* Allows us to disable this page for testing purposes */
// TESTING disable for prod
if (true) {
// if (localStorage.getItem('devAccount') !== 'true') {
    window.onload = editorStyles;
    document.addEventListener('DOMContentLoaded', main);
} else {
    console.warn('byui.js disabled for testing');
}

/* inject css into tinyMCE editors on page. Has to wait till tinyMCE is done loading */
function editorStyles() {
    try {
        /* if there are no WYSIWYG's on the page, don't bother running */
        if (typeof tinyMCE === 'undefined') {
            return;
        }
        /* our css, canvas common css, canvas color vars css */
        var regExes = [/byui\.css$/, /online\.css$/, /common[\w-]*\.css$/, /variables[\w-]*\.css$/, /campus\.css$/, /pathway\.css$/];
        var cssHrefs = [...document.querySelectorAll('link[rel=stylesheet]')].reduce((accum, linkTag) => {
            var href = linkTag.getAttribute('href');

            /* only keep the link if it matches one of the regExes */
            if (regExes.some(regEx => href.match(regEx) !== null)) {
                accum.push(href);
            }
            return accum;
        }, []);

        tinyMCE.editors.forEach(editor => {
            cssHrefs.forEach(href => {
                editor.dom.styleSheetLoader.load(href);
            });
        });

    } catch (editorErr) {
        console.error(editorErr);
    }
}


function main() {
    var courseNumber = document.location.pathname.split('/')[2];

    /* Initialize accordion - JQUERY UI */
    function initializeAccordion() {
        try {
            $('div.accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active: false
            });
        } catch (accordionErr) {
            console.error(accordionErr);
        }
    }

    /* Initialize tabs - JQUERY UI */
    function initializeTabs() {
        try {
            $('#styleguide-tabs-demo-minimal').tabs();
        } catch (tabErr) {
            console.error(tabErr);
        }
    }

    /* Insert custom video tag generation scripts */
    function insertVideoTag() {
        try {
            var videos = document.querySelectorAll('.byui-video');
            for (var i = 0; i < videos.length; i++) {
                if (videos[i].dataset.source == 'youtube') {
                    videos[i].innerHTML = `<iframe width="${videos[i].dataset.width}px" height="${videos[i].dataset.height}px" src="https://www.youtube.com/embed/${videos[i].dataset.vidid}" frameborder="0" allowfullscreen></iframe>`;
                } else if (videos[i].dataset.source == 'kaltura') {
                    videos[i].innerHTML = `<iframe width="${videos[i].dataset.width}px" height="${videos[i].dataset.height}px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id=${videos[i].dataset.vidid}&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>`;
                }
            }
        } catch (videoErr) {
            console.error(videoErr);
        }
    }

    /* handles all functions required to generate the course homepage */
    function generateHomePage() {
        /* generate top buttons (under.steps) */
        function generateSteps(modules) {
            try {
                /* generate link to instructor bio - make the api call to get enrollments*/
                $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments?type%5B%5D=TeacherEnrollment?per_page=50`, teachers => {
                    /* check for multiple instances of the same teacher */
                    teachers = teachers.map(teacher => teacher.user_id).filter((teacherId, i, teachers) => teachers.indexOf(teacherId) === i);

                    if (teachers.length > 1) {
                        /* If there are multiple unique teachers */
                        console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.');
                    } else if (teachers.length === 0) {
                        /* if the teacher isn't enrolled for some reason */
                        console.log('Unable to find teacher enrollment.');
                    } else {
                        /* if we have one teacher set the URL */
                        instructor.href = `/courses/${courseNumber}/users/${teachers[0]}`;
                    }
                });

                /* Get additional resources module item */
                var resourcesModule = modules.find(canvasModule => /student\s*resources/i.test(canvasModule.name));

                /* set home page buttons */
                var start = document.querySelector('#start'),
                    iLearnTutorial = document.querySelector('#tutorial'),
                    resources = document.querySelector('#resources');

                if (start)
                    start.href = `/courses/${courseNumber}/modules#module_${modules[0].id}`;
                if (iLearnTutorial)
                    iLearnTutorial.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw';
                if (resources && resourcesModule)
                    resources.href = `/courses/${courseNumber}/modules#module_${resourcesModule.id}`;
            } catch (generateStepsErr) {
                console.error(generateStepsErr);
            }
        }

        /* generate lesson links (under .lessons) */
        function generateLessons(modules) {
            try {
                /* Generate a Module link - called by above try statement */
                function generateLessonLink(moduleId, moduleCount) {
                    moduleCount++;
                    /* append leading 0 */
                    if (moduleCount < 10)
                        moduleCount = `0${moduleCount}`;
                    document.querySelector(lessonWrapperSelector).insertAdjacentHTML('beforeend', `<a href='/courses/${courseNumber}/modules#module_${moduleId}' style='width: calc(100% / ${modulesPerRow} - 20px);'>${moduleCount}</a>`);
                }

                var lessonWrapperSelector = '#navigation .lessons';

                /* clear lesson div & generate module links if generate class exists */
                if ([...document.querySelector(lessonWrapperSelector).classList].includes('generate')) {
                    document.querySelector(lessonWrapperSelector).innerHTML = '';
                    /* remove modules with invalid names & get modulesPerRow (limit 7) */
                    var validModules = modules.filter(canvasModule => {
                            return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(canvasModule.name);
                        }),
                        modulesPerRow = validModules.length > 7 ? 7 : validModules.length;

                    /* generate module links */
                    validModules.forEach((canvasModule, i) => {
                        generateLessonLink(canvasModule.id, i);
                    });
                }
            } catch (generateLessonErr) {
                console.error(generateLessonErr);
            }
        }

        try {
            /* quit if we are not on the course homepage OR the page is missing the expected format */
            if (document.querySelectorAll('#navigation .steps, #navigation .lessons').length === 0) {
                return;
            }

            /* get course modules */
            $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', (modules) => {

                generateSteps(modules);
                generateLessons(modules);
            });
        } catch (selectorErr) {
            console.error(selectorErr);
        }
    }

    /* Hide the 3rd breadcrumb */
    function alterBreadcrumb() {
        try {
            /* If there are 4 total, AND we're inside a course AND we're not in a group tab */
            if (document.querySelectorAll('#breadcrumbs li').length === 4 && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)) {
                document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML = 'Modules';
                /* update the link */
                document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href = document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i, '/modules');
            }
        } catch (breadcrumbErr) {
            console.error(breadcrumbErr);
        }
    }

    /* enable prism pre > code highlighting */
    function prismHighlighting() {
        try {
            let codeUsed = document.querySelector('pre code');
            if (codeUsed == null) return;

            let jsEle = document.createElement('script'),
                cssEle = document.createElement('link');
            jsEle.src = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js';
            cssEle.href = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css';
            cssEle.rel = 'stylesheet';
            document.head.appendChild(jsEle);
            document.head.appendChild(cssEle);

        } catch (prismErr) {
            console.error(prismErr);
        }
    }

    /* Insert copyright footer */
    function addCopyrightFooter() {
        try {
            var page = document.getElementById('content');
            if (page) {
                /* don't add one if it already exists */
                if (!document.querySelector('p.copyright') && !document.querySelector('p#byui-copyright'))
                    page.insertAdjacentHTML('beforeend', `<p id='byui-copyright'>Copyright ${new Date().getFullYear()} Brigham Young University-Idaho</p>`);
            } else {
                throw new Error('unable to add copyright footer to page');
            }
        } catch (copyrightErr) {
            console.error(copyrightErr);
        }
    }

    /* add quiz.next tooltips where needed */
    function addTooltips() {
        let borderColor = 'black';
        const divId = 'byui-quizzes-next-tooltip';
        const settingsPage = window.location.href.includes('settings');
        const assignmentsHTML = '<div>Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features/div>';
        const settingsHTML = '<div>Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>';

        /* if the current href isn't the settings page or the assignments page, then return */
        if (!settingsPage && !window.location.href.includes('assignments')) {
            return;
        }

        /* create the tooltip div and set its attributes */
        const div = document.createElement('div');
        div.setAttribute('id', divId);
        div.setAttribute('style', 'display:none');

        /* assignment page's innerHTML for the tooltip */
        div.innerHTML = assignmentsHTML;

        /* the setting's page borderColor and innerHTML are different than the assignment's page */
        if (settingsPage) {
            borderColor = 'red';
            div.innerHTML = settingsHTML;
        }

        /* create a style tag on the document and set its innerHTML */
        const style = document.createElement('style');
        style.innerHTML = `
    .tippy-tooltip.honeybee-theme {
        border: 2px solid ${borderColor};
        background-color: white;
        color: black;
        max-width: 200px;
      }
      .tippy-backdrop {
        background: white;
      }`;

        /* create a script tag, add the tooltip JavaScript to it, and add the tag to the document */
        const selectors = '.quizzes_next, .new_quiz_lti_wrapper';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function () {
            tippy(selectors, {
                html: `#${divId}`,
                interactive: true,
                placement: 'bottom-end',
                theme: 'honeybee',
                size: 'large'
            });
        };
        script.src = 'https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js';

        /* put the html tags in the document */
        document.body.appendChild(div);
        document.head.appendChild(style);
        document.head.appendChild(script);

    }

    initializeAccordion();
    initializeTabs();
    insertVideoTag();
    generateHomePage();
    alterBreadcrumb();
    prismHighlighting();
    addCopyrightFooter();
    addTooltips();
}
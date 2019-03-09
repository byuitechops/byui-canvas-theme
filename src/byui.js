/*eslint-env browser */
/* eslint no-console:0 */
/* global tinyMCE, tippy, $ */

(function () {
    window.addEventListener('onload', editorStyles);
    document.addEventListener('DOMContentLoaded', main);

    function checkForJquery(cb) {
        function loadJquery() {
            console.log('loading jQuery');
            var jqueryScript = document.createElement('script');
            jqueryScript.href = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
            jqueryScript.onload = cb;
            document.head.appendChild(jqueryScript);
        }
        try {
            if (typeof $ == 'undefined' || typeof $().jquery == 'undefined') {
                loadJquery();
            } else {
                // check version
                var minimumVersion = '1.7.0'.split('.');
                var currentVersion = $().jquery.split('.');
                var validVersion = true;

                for (let i = 0; i < minimumVersion.length; i++) {
                    if (currentVersion[i] > minimumVersion[i]) {
                        break;
                    } else if (currentVersion < minimumVersion) {
                        validVersion = false;
                        break;
                    }
                }

                if (!validVersion) {
                    loadJquery();
                    return;
                }

                cb();
            }
        } catch (loadjQueryErr) {
            console.error(loadjQueryErr);
        }
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
                if (document.querySelector('.byui div.accordion')) {
                    checkForJquery(jQueryErr => {
                        if (jQueryErr) {
                            throw jQueryErr;
                        }

                        $('.byui div.accordion').accordion({
                            heightStyle: 'content',
                            collapsible: true,
                            active: false
                        });
                    });
                }
            } catch (accordionErr) {
                console.error(accordionErr);
            }
        }

        /* Initialize dialog - JQUERY UI */
        function initializeDialog() {
            try {
                if (document.querySelector('.byui div.dialog')) {
                    checkForJquery(jQueryErr => {
                        if (jQueryErr) {
                            throw jQueryErr;
                        }
                        /* get all jQueryUI dialog boxes */
                        document.querySelectorAll('.byui .Button[id^=\'link_\']').forEach(button => {
                            /* Save linkID */
                            let buttonId = /link_(\d+)/i.exec(button.id)[1];
                            let $button = $(`.byui #dialog_for_link_${buttonId}`);

                            /* instantiate dialog */
                            $button.dialog({
                                autoOpen: false
                            });

                            /* add event listener to open dialog */
                            button.addEventListener('click', (e) => {
                                e.preventDefault();
                                $button.dialog('open');
                            });
                        });
                    });
                }
            } catch (dialogErr) {
                console.error(dialogErr);
            }
        }

        /* Initialize tabs - JQUERY UI */
        function initializeTabs() {
            try {
                checkForJquery(jQueryErr => {
                    if (jQueryErr) {
                        throw jQueryErr;
                    }

                    $('.byui #styleguide-tabs-demo-minimal').tabs();
                });
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
                    /* Get additional resources module item */
                    var resourcesModule = modules.find(canvasModule => /student\s*resources/i.test(canvasModule.name));

                    /* set home page buttons */
                    var start = document.querySelector('.byui #start'),
                        iLearnTutorial = document.querySelector('.byui #tutorial'),
                        resources = document.querySelector('.byui #resources'),
                        instructor = document.querySelector('.byui #instructor');

                    if (start)
                        start.href = `/courses/${courseNumber}/modules#module_${modules[0].id}`;
                    if (iLearnTutorial)
                        iLearnTutorial.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation';
                    if (resources && resourcesModule)
                        resources.href = `/courses/${courseNumber}/modules#module_${resourcesModule.id}`;

                    /* generate link to instructor bio - make the api call to get enrollments*/
                    $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments?type%5B%5D=TeacherEnrollment&per_page=50`, teachers => {
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

                    var lessonWrapperSelector = '.byui #navigation .lessons';

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
                let stepsExist = document.querySelectorAll('.byui #navigation .steps').length > 0,
                    lessonsExist = document.querySelectorAll('.byui #navigation .lessons').length > 0;
                if (!stepsExist && !lessonsExist) {
                    return;
                }

                checkForJquery(jQueryErr => {
                    if (jQueryErr) {
                        throw jQueryErr;
                    }
                    /* get course modules */
                    $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', (modules) => {
                        /* Don't run steps if they don't exist (or lessons) */
                        if (stepsExist) {
                            generateSteps(modules);
                        }
                        if (lessonsExist) {
                            generateLessons(modules);
                        }
                    });
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
            try {
                let borderColor = 'black';
                const divId = 'byui-quizzes-next-tooltip';
                const assignmentsHTML = `<div id="${divId}" style="display: none;">Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features</div>`;
                const settingsHTML = `<div id="${divId}" style="display: none;">Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>`;

                /* Add appropriate tooltip OR return if we're on the wrong page */
                if (window.location.href.includes('settings')) {
                    document.head.insertAdjacentHTML('beforeend', settingsHTML);
                    borderColor = 'red';
                } else if (window.location.href.includes('assignments')) {
                    document.head.insertAdjacentHTML('beforeend', assignmentsHTML);
                } else {
                    return;
                }

                /* Add tooltip styles to DOM with appropriate border color */
                const styleGuts = `<style>.tippy-tooltip.byui-theme {border: 2px solid ${borderColor};background-color: white;color: black;max-width: 200px;}.tippy-backdrop {background: white;}</style>`;

                document.head.insertAdjacentHTML('beforeend', styleGuts);

                /* create a script tag, add the tooltip JavaScript to it, and add the tag to the document */
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js';
                script.onload = () => {
                    tippy('.quizzes_next, .new_quiz_lti_wrapper', {
                        html: `#${divId}`,
                        interactive: true,
                        placement: 'bottom-end',
                        theme: 'byui',
                        size: 'large'
                    });
                };
                document.head.appendChild(script);
            } catch (tooltipErr) {
                console.error(tooltipErr);
            }
        }

        /* load JS & CSS needed for image carousels if there is one on the page */
        function loadSlickJS() {
            try {
                /* don't load scripts if they aren't being used on the current page */
                if (document.querySelectorAll('.byui .carousel').length === 0) {
                    return;
                }
                var slickScript = document.createElement('script');
                slickScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js';
                /* Initialize carousels if any are present on page */
                slickScript.onload = () => {
                    checkForJquery(jQueryErr => {
                        if (jQueryErr) {
                            throw jQueryErr;
                        }

                        $('.byui .carousel').slick({
                            dots: true,
                        });
                    });
                };
                document.head.appendChild(slickScript);

                var slickScriptCss = document.createElement('link');
                slickScriptCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css';
                slickScriptCss.rel = 'stylesheet';
                document.head.appendChild(slickScriptCss);

                var slickScriptTheme = document.createElement('link');
                slickScriptTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css';
                slickScriptTheme.rel = 'stylesheet';
                document.head.appendChild(slickScriptTheme);
            } catch (slickErr) {
                console.error(slickErr);
            }
        }

        initializeAccordion();
        initializeDialog();
        initializeTabs();
        insertVideoTag();
        generateHomePage();
        alterBreadcrumb();
        prismHighlighting();
        addCopyrightFooter();
        addTooltips();
        loadSlickJS();
    }
})();
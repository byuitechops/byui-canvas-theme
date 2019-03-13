/*eslint-env browser */
/* eslint no-console:0 */
/* global tinyMCE, tippy, $ */


(function () {

    document.addEventListener('DOMContentLoaded', function () {
        run(initializeDialog);
        run(generateHomePage);
        run(prismHighlighting);
        run(addCopyrightFooter);
    });



    function run(fn) { try { fn(); } catch (e) { console.error(e); } }

    function loadScript(href, cb) {

        /* Checks if the script is already injected. If not, it will add it */
        if (document.querySelector('script[src="' + href + '"]') === null) {

            var script = document.createElement('script');
            script.src = href;
            /* Call the callback once it is done loading */
            if (cb) {

                script.addEventListener('load', cb, { once: true });
            }
            /* Append script to the head of the document */
            document.head.appendChild(script);
        }
    }

    function loadStyle(href, cb) {
        /* Checks if the style is already injected. If not, it will add it */
        if (document.querySelector('link[href="' + href + '"]') === null) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            /* Call the callback once it is done loading */
            if (cb) {
                script.addEventListener('load', cb, { once: true });

            }
            /* Append style to the head of the document */
            document.head.appendChild(link);
        }
    }


    function getjQuery(cb) {
        /* If jQuery is already saved, use that */
        if (this.jQuery) return cb(this.jQuery);

        function lessThan(A, B) {
            if (A.length != B.length) throw new Error('Comparing two different sizes');

            for (var i = 0; i < A.length; i++) {
                /* A is greater than B */
                if (A[i] > B[i]) return false;
                /* A is less than B */
                else if (A[i] < B[i]) return true;
            }
            /* If A and B are equal */
            return false;
        }

        var needToLoad = true;

        if (typeof jQuery != 'undefined' || typeof jQuery().jquery != 'undefined') {
            var currentVersion = jQuery().jquery.split('.');
            needToLoad = lessThan(currentVersion, [1, 7, 0]);
        }

        if (needToLoad) {
            loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', function () {
                this.jQuery = jQuery.noConflict();
                cb(this.jQuery);
            })
        } else {
            this.jQuery = jQuery;
            cb(jQuery);
        }
    }


    /* Initialize dialog - JQUERY UI */
    function initializeDialog() {
        if (document.querySelector('.byui div.dialog')) {

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
        }
    }


    /* generate top buttons (under.steps) */
    function generateSteps(courseNumber, modules) {
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

        getjQuery($ => {
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
        });
    }

    /* generate lesson links (under .lessons) */
    function generateLessons(courseNumber, modules) {

        var lessonWrapper = document.querySelector('.byui #navigation .lessons');
        /* clear lesson div & generate module links if generate class exists */
        if (lessonWrapper.classList.contains('generate')) {
            lessonWrapper.innerHTML = '';
            /* remove modules with invalid names & get modulesPerRow (limit 7) */
            var validModules = modules.filter(canvasModule => {
                return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(canvasModule.name);
            });
            var modulesPerRow = validModules.length > 7 ? 7 : validModules.length;

            /* generate module links */
            validModules.forEach((canvasModule, i) => {
                var moduleCount = (i < 9 ? '0' : '') + (i + 1);
                lessonWrapper.insertAdjacentHTML('beforeend', `<a href='/courses/${courseNumber}/modules#module_${canvasModule.id}' style='width: calc(100% / ${modulesPerRow} - 20px);'>${moduleCount}</a>`)
            });
        }
    }

    /* handles all functions required to generate the course homepage */
    function generateHomePage() {

        /* if we are on the course homepage and the page has the expected format */
        var steps = document.querySelector('.byui #navigation .steps');
        var lessons = document.querySelector('.byui #navigation .lessons');
        if (steps && lessons) {
            var courseNumber = document.location.pathname.split('/')[2];
            /* get course modules */
            getjQuery($ => {
                $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', (modules) => {

                    /* Don't run steps or lessons if they don't exist */
                    if (steps) generateSteps(courseNumber, modules);
                    if (lessons) generateLessons(courseNumber, modules);
                });
            });
        }
    }

    /* enable prism pre > code highlighting */
    function prismHighlighting() {
        // add .byui as a selector
        if (document.querySelector('.byui pre code')) {
            loadScript('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js');
            loadStyle('https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css');
        }
    }

    /* Insert copyright footer */
    function addCopyrightFooter() {
        var page = document.getElementById('content');
        if (page) {
            /* don't add one if it already exists */
            if (!document.querySelector('p.copyright') && !document.querySelector('p#byui-copyright') && !window.location.pathname.includes('speed_grader'))
                page.insertAdjacentHTML('beforeend', `<p id='byui-copyright'>Copyright ${new Date().getFullYear()} Brigham Young University-Idaho</p>`);
        } else {
            console.warn('unable to add copyright footer to page');
        }
    }

})();
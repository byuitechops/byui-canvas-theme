/*eslint-env node, browser, jquery*/

if (localStorage.getItem('devAccount') !== 'true') {
    document.addEventListener('DOMContentLoaded', main);
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
        /* quit if we are not on the course homepage OR the page is missing the expected format */
        if (document.querySelectorAll('#navigation .steps').length === 0) {
            return;
        }
        var iLearnTutorial = document.querySelector('#tutorial');
        var start = document.querySelector('#start');
        var instructor = document.querySelector('#instructor');
        var resources = document.querySelector('#resources');

        function generateModuleLinks() {
            try {
                /* get modules */
                $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', (modules) => {
                    var resourcesId,
                        lessonWrapperSelector = '#navigation .lessons',
                        lessonCounter = 0;
                    /* Generate a Module link - called by above try statement */
                    function generateModuleLink(moduleId, moduleCount) {
                        var modNum = moduleCount + 1;
                        /* append leading 0 */
                        if (moduleCount + 1 < 10)
                            modNum = `0${moduleCount + 1}`;
                        document.querySelector(lessonWrapperSelector).insertAdjacentHTML('beforeend', `<a href='/courses/${courseNumber}/modules#module_${moduleId}' style='width: calc(100% / ${modulesPerRow} - 20px);'>${modNum}</a>`);
                    }

                    /* clear lesson div & generate module links if generate class exists */
                    if (Array.from(document.querySelector(lessonWrapperSelector).classList).includes('generate')) {
                        document.querySelector(lessonWrapperSelector).innerHTML = '';
                        /* remove modules with invalid names & get modulesPerRow (limit 7) */
                        var validModules = [];
                        modules.forEach(canvasModule => {
                            if (/(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(canvasModule.name)) {
                                validModules.push(canvasModule);
                            } else if (/student\s*resources/i.test(canvasModule.name)) {
                                resourcesId = canvasModule.id;
                            }
                        });
                        var modulesPerRow = validModules.length > 7 ? 7 : validModules.length;

                        /* generate module links */
                        validModules.forEach((canvasModule) => {
                            generateModuleLink(canvasModule.id, lessonCounter);
                            lessonCounter++;
                        });
                    }

                    /* set home page buttons */
                    if (start)
                        start.href = `/courses/${courseNumber}/modules#module_${modules[0].id}`;
                    if (iLearnTutorial)
                        iLearnTutorial.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw';
                    if (resources)
                        resources.href = `/courses/${courseNumber}/modules#module_${resourcesId}`;
                });
            } catch (moduleErr) {
                console.error(moduleErr);
            }
        }

        function generateInstructorLink() {
            try {
                /* make the api call to get enrollments */
                $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments?per_page=100`, function (people) {
                    var teacher = people.filter(person => person.type === 'TeacherEnrollment');
                    if (teacher.length > 1) {
                        /* if there are multiple teachers add the link manually */

                        let id = teacher[0].user_id;
                        let multipleTeachers = teacher.find(teach => teach.user_id !== id) != undefined;

                        if (multipleTeachers === true) {
                            console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.');
                            return;
                        }

                    } else if (teacher.length === 0) {
                        /* if the teacher isn't enrolled for some reason */
                        console.log('Unable to find teacher enrollment.');
                        return;
                    }

                    /* if we have a teacher fix the button */
                    instructor.href = `/courses/${courseNumber}/users/${teacher[0].user_id}`;
                });
            } catch (instructorErr) {
                console.error(instructorErr);
            }
        }

        generateModuleLinks();
        generateInstructorLink();
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

    initializeAccordion();
    initializeTabs();
    insertVideoTag();
    generateHomePage();
    alterBreadcrumb();
}
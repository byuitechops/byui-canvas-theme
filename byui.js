/*eslint-env node, browser, jquery*/

document.addEventListener('DOMContentLoaded', () => {
    var courseNumber = document.location.pathname.split('/')[2];

    /* Initialize accordion - JQUERY UI */
    $('div.accordion').accordion({
        heightStyle: 'content',
        collapsible: true,
        active: false
    });

    /* Initialize tabs - JQUERY UI */
    $('#styleguide-tabs-demo-minimal').tabs();

    /* Generate course home pages */
    if (document.querySelectorAll('#navigation .steps').length !== 0) {
        var iLearnTutorial = document.querySelector('#tutorial');
        var start = document.querySelector('#start');
        var instructor = document.querySelector('#instructor');
        var resources = document.querySelector('#resources');

        /* get modules */
        $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', function (modules) {
            var resourcesId;
            var generate = false;
            var lessonCounter = 0;
            /* clear lesson div & set generate */
            try {
                if ($('#navigation .lessons').hasClass('generate')) {
                    $('#navigation .lessons').html('');
                    generate = true;
                }
                /* append lesson wrappers IF they are missing */
                if ($('#navigation .lessons>div').length <= 0) {
                    $('#navigation .lessons').append('<div></div><div></div>');
                }
                /* generate module links */
                modules.forEach((module) => {
                    /* if the module is a week/lesson & generate is true */
                    if (/(Weeks?|Lesson)\s*(1[0-4]|0?\d(\D|$))/gi.test(module.name) && generate) {
                        generateModuleLink(module.id, lessonCounter);
                        lessonCounter++;
                    }
                });
            } catch (createLinkErr) {
                console.error(createLinkErr);
            }

            /* Generate a Module link - called by above try statement */
            function generateModuleLink(moduleId, moduleCount) {
                var selector;
                /* get correct row */
                if (moduleCount <= 6) {
                    selector = '#navigation .lessons div:first-child';
                } else {
                    selector = '#navigation .lessons div:last-child';
                }
                var modNum = moduleCount + 1;
                /* append leading 0 */
                if (moduleCount + 1 < 10) modNum = `0${moduleCount + 1}`;
                document.querySelector(selector).insertAdjacentHTML('beforeend', `<a href='/courses/${courseNumber}/modules#module_${moduleId}'>${modNum}</a>`);
            }


            /* set home page buttons */
            try {
                if (start) start.href = `/courses/${courseNumber}/modules#module_${modules[0].id}`;
                if (iLearnTutorial) iLearnTutorial.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw';
                if (resources) resources.href = `/courses/${courseNumber}/modules#module_${resourcesId}`;
            } catch (linkErr) {
                console.error(linkErr);
            }
        });
        /* make the api call to get enrollments */
        $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments?per_page=100`, function (people) {
            people.forEach(function (person) {
                // if we have a teacher fix the button
                if (person.type === 'TeacherEnrollment') {
                    instructor.prop('href', `/courses/${courseNumber}/users/${person.user_id}`);
                }
            });
        });
    }
});

/* Insert custom video tag generation scripts */
try {
    var videos = document.querySelectorAll('byui-video');
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
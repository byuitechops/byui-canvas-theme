/*eslint-env node, browser, jquery*/

/* Inject necessary scripts */
var jquery = document.createElement('script');
jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
document.body.appendChild(jquery);

var bootStrap = document.createElement('script');
bootStrap.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js';
document.body.appendChild(bootStrap);

$(document).ready(function () {
    var courseNumber = document.location.pathname.split('/')[2];
    var courseClass = $('#breadcrumbs ul li:nth-child(2)').text().split('.');
    courseClass = courseClass[courseClass.length - 1].toLowerCase().replace(' ', '');

    /* Initialize accordion*/
    $('div.accordion').accordion({
        heightStyle: 'content',
        collapsible: true,
        active: false
    });

    /* Initialize tabs */
    $('#styleguide-tabs-demo-minimal').tabs();

    /* Generate course home pages */
    if ($('#navigation .steps').length !== 0) {
        var iLearnTutorial = $('#tutorial');
        var start = $('#start');
        var instructor = $('#instructor');
        var syllabus = $('#syllabus');
        var resources = $('#resources');
        $.get('/api/v1/courses/' + courseNumber + '/modules?per_page=30', function (modules) {
            var resourcesId;
            var generate = false;
            var lessonCounter = 0;
            if ($('#navigation .lessons').hasClass('generate')) {
                $('#navigation .lessons').html('');
                generate = true;
            }
            /* append lesson wrappers IF they are missing */
            if ($('#navigation .lessons>div').length <= 0) {
                $('#navigation .lessons').append('<div></div><div></div>');
            }
            // why is student resources special?
            modules.forEach((module) => {
                if (module.name == 'Student Resources') {
                    resourcesId = module.id;
                    return false;
                }
                /* if the module is a week/lesson & generate is true */
                if (/(Weeks?|Lesson)\s*(1[0-4]|0?\d(\D|$))/gi.test(module.name) && generate) {
                    generateModuleLink(module.id, lessonCounter);
                    lessonCounter++;
                }
            });

            start.prop('href', `/courses/${courseNumber}/modules#module_${modules[0].id}`);
            syllabus.prop('href', `/courses/${courseNumber}/assignments/syllabus`);
            iLearnTutorial.prop('href', 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw');
            resources.prop('href', `/courses/${courseNumber}/modules#module_${resourcesId}`);

            /* Generate Module links */
            function generateModuleLink(id, index) {
                var selector;
                if (index <= 6) {
                    selector = '#navigation .lessons div:first-child';
                } else {
                    selector = '#navigation .lessons div:last-child';
                }
                var modNum = index + 1;
                if (index + 1 < 10) modNum = `0${index + 1}`;
                $(selector).append(`<a href='/courses/${courseNumber}/modules#module_${id}'>${modNum}</a>`);
            }
        });
        //make the api call to get enrollments
        $.get(`https://byui.instructure.com/api/v1/courses/${courseNumber}/enrollments`, function (people) {
            people.forEach(function (person) {
                //if we have a teacher fix the button
                if (person.type === 'TeacherEnrollment') {
                    instructor.prop('href', `/courses/${courseNumber}/users/${person.user_id}`);
                }
            });
        });
    }

    /* Highlight Modules on navigation */
    if (document.location.hash.includes('module_')) {
        var hashId = document.location.hash;
        $(hashId).parent().addClass('focus');
        $(hashId).parent().addClass(courseClass);
    }

    /* Insert copyright footer */
    var p = document.createElement('p');
    p.innerHTML = `Copyright ${new Date().getFullYear()} Brigham Young University-Idaho`;
    p.classList.add('copyright');
    var page = document.getElementById('content'); // TODO This places the copyright at the bottom of EVERY page in canvas
    page.appendChild(p);


    /* Hide the 3rd breadcrumb IF there are 4 total, AND we're inside a course AND we're not in a group tab */
    if ($('#breadcrumbs ul li').length === 4 && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href) ) {
        $('#breadcrumbs ul li:nth-child(3) span')[0].innerHTML = 'Modules';
        $('#breadcrumbs ul li:nth-child(3) a')[0].href = $('#breadcrumbs ul li:nth-child(3) a')[0].href.replace(/\/\w+$/i, '/modules');
    }
});


/* Keep the nav even on scroll down */
/* scroll differently if you're managing a files page */
var filesPage = /(\.com|\d+)\/files($|\/folder)/i.test(window.location.href);
document.addEventListener('scroll', () => {
    var height;
    if (filesPage) {
        height = `${window.scrollY}px`;
    } else if (window.scrollY < 63) {
        height = `${0}px`;
    } else {
        height = `${window.scrollY - 63}px`;
    }

    document.getElementById('left-side').style.top = height;
});


/* Insert custom video tag generation scripts */
var videos = document.querySelectorAll('byui-video');
for (var i = 0; i < videos.length; i++) {
    if (videos[i].dataset.source == 'youtube') {
        videos[i].innerHTML = `<iframe width="${videos[i].dataset.width}px" height="${videos[i].dataset.height}px" src="https://www.youtube.com/embed/${videos[i].dataset.vidid}" frameborder="0" allowfullscreen></iframe>`;
    } else if (videos[i].dataset.source == 'kaltura') {
        videos[i].innerHTML = `<iframe width="${videos[i].dataset.width}px" height="${videos[i].dataset.height}px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id=${videos[i].dataset.vidid}&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>`;
    }

}
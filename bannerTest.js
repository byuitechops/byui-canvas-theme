/* eslint no-console:0 */
/* global $ */

var courseNumber = document.location.pathname.match(/courses\/(\d+)/i);
courseNumber = courseNumber? courseNumber[1]: null;

/* BANNER ABOVE */
try {
    /* If we're inside a course AND it's in the Top Banner module */
    if (courseNumber && /12999\/[\s\S]*module_item_id=(870114|870117|870120|870123)/i.test(window.location.href)) {
        // TESTING remove this for production. Applies CSS ONLY to a specific module in a specific course
        document.querySelector('body').classList.add('topBanner');

        /* If we know the course number And we're inside a course */
        if (courseNumber && /\.com\/courses\/\d+/i.test(window.location.href)) {
            /* get the course name */
            $.getJSON('https://' + window.location.hostname + '/api/v1/courses/' + courseNumber, function (response) {
                if (response.name && response.course_code) {
                    var courseCode = response.course_code.toLowerCase().replace(/\s/g, '').split(':')[0];
                    document.getElementById('wrapper').insertAdjacentHTML('afterbegin', 
                        `<div id='courseBanner' class='${courseCode}' style='background-image:url(https://byui.instructure.com/courses/${courseNumber}/file_contents/course%20files/template/courseBanner.jpg);'>${response.name}</div>`);
                }
            });
        } else {
            // TESTING else only needed if page is shifting up
            // document.querySelector('.ic-app-nav-toggle-and-crumbs').style.marginTop = '0';
        }
    }
} catch (err) {
    console.error(err);
}

/* BANNER BEHIND BREADCRUMBS */
try {
    /* If we're inside a course AND it's in the breadcrumb banner module */
    if (courseNumber && /12999\/[\s\S]*module_item_id=(870122|870113|870119|870116)/i.test(window.location.href)) {
        // TESTING remove this for production. Applies CSS ONLY to a specific module in a specific course
        document.querySelector('body').classList.add('breadcrumbBanner');

        var courseBanner = document.querySelector('.ic-app-nav-toggle-and-crumbs');

        requestAnimationFrame(() => {
            /* get width of breadcrumbs */
            var breadcrumbWidth = document.getElementById('breadcrumbs').offsetWidth;
            
            /* set background image of courseBanner */
            /* Done in JS B/C URL is dynamic */
            courseBanner.style.backgroundImage = `url(https://byui.instructure.com/courses/${courseNumber}/file_contents/course%20files/template/courseBanner.jpg)`;
            
            const additionalWidth = '450px';
            
            /* set width of fade dynamically. For browsers without CSS variable support */
            document.querySelector('head').insertAdjacentHTML('beforeend', `<style type='text/css'>
            .ic-app-nav-toggle-and-crumbs::before {
                width: calc(${breadcrumbWidth}px + ${additionalWidth}) !important;
            }
            </style>`);
        });
    }
} catch (bannerErr) {
    console.error(bannerErr);
}
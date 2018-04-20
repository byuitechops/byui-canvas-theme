/*eslint-env node, browser, jquery, es6*/

$(document).ready(function () {

    try {
        var courseNumber = document.location.pathname.split('/')[2];
        /* Generate Course Banner at the top of the page */
        /* If we know the course number And we're inside a course */
        if (courseNumber && /\.com\/courses\/\d+/i.test(window.location.href)) {
            $.getJSON('https://' + window.location.hostname + '/api/v1/courses/' + courseNumber, function (response) {
                if (response.name && response.course_code) {
                    var courseCode = response.course_code.toLowerCase().replace(/\s/g, '').split(':')[0];
                    $('#wrapper').prepend($('<div id=\'overallCourseBanner\' class=\'' + courseCode + '\'>' + response.name + '</div>'));
                }
            });
        }
    } catch (bannerErr) {
        console.error(bannerErr);
    }

    try {
        /* Insert copyright footer */
        var p = document.createElement('p');
        p.innerHTML = 'Copyright ' + new Date().getFullYear() + ' Brigham Young University-Idaho';
        p.classList.add('copyright');
        var page = document.getElementById('content');
        page.appendChild(p);
    } catch (copyrightErr) {
        console.error(copyrightErr);
    }

    try {
        /* Hide the 3rd breadcrumb */
        /* IF there are 4 total, AND we're inside a course AND we're not in a group tab */
        if ($('#breadcrumbs ul li').length === 4 && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href)) {
            $('#breadcrumbs ul li:nth-child(3) span')[0].innerHTML = 'Modules';
            $('#breadcrumbs ul li:nth-child(3) a')[0].href = $('#breadcrumbs ul li:nth-child(3) a')[0].href.replace(/\/\w+$/i, '/modules');
        }
    } catch (breadcrumbErr) {
        console.error(breadcrumbErr);
    }
});

try {
    /* Keep the course nav even on scroll down */
    /* scroll differently if you're managing a files page */
    var filesPage = /(\.com|\d+)\/files($|\/folder)/i.test(window.location.href);
    document.addEventListener('scroll', function () {
        // height without banner is 63px. Had to add 50px for the banner
        var height;
        if (filesPage) {
            height = window.scrollY + 'px';
        } else if (window.scrollY < 113) {
            height = 0 + 'px';
        } else {
            height = window.scrollY - 113 + 'px';
        }

        document.getElementById('left-side').style.top = height;
    });
} catch (stickyNavErr) {
    console.error(stickyNavErr);
}
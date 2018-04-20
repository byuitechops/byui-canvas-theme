/*eslint-env node, browser, jquery, es6*/

document.addEventListener('DOMContentLoaded', function () {
    /* Generate Course Banner at the top of the page */
    try {
        var courseNumber = document.location.pathname.split('/')[2];
        /* If we know the course number And we're inside a course */
        if (courseNumber && /\.com\/courses\/\d+/i.test(window.location.href)) {
            $.getJSON('https://' + window.location.hostname + '/api/v1/courses/' + courseNumber, function (response) {
                if (response.name && response.course_code) {
                    var courseCode = response.course_code.toLowerCase().replace(/\s/g, '').split(':')[0];
                    document.getElementById('wrapper').insertAdjacentHTML('afterbegin', '<div id=\'overallCourseBanner\' class=\'' + courseCode + '\'>' + response.name + '</div>');
                }
            });
        }
    } catch (bannerErr) {
        console.error(bannerErr);
    }

    /* Insert copyright footer */
    try {
        var p = document.createElement('p');
        p.innerHTML = 'Copyright ' + new Date().getFullYear() + ' Brigham Young University-Idaho';
        p.classList.add('copyright');
        var page = document.getElementById('content');
        page.appendChild(p);
    } catch (copyrightErr) {
        console.error(copyrightErr);
    }

    /* Hide the 3rd breadcrumb */
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
});

/* Keep the course nav even on scroll down */
try {
    /* scroll differently if you're on a manage files page */
    var filesPage = /(\.com|\d+)\/files($|\/folder)/i.test(window.location.href);
    document.addEventListener('scroll', function () {
        var height;
        var offsetHeight = 113; // 113px is height of courseBanner(50px) + canvas breadcrumb nav(63px)

        /* Calculating this value by hand requires a dependency on complex CSS selectors 
        every time the event fires, which is why it's hard coded */

        /* set nav offset */
        if (filesPage) {
            /* nav offset is different for files pages */
            height = window.scrollY + 'px';
        } else if (window.scrollY < offsetHeight) {
            /* if you're at the top of the page don't mess with the offset */
            height = '0px';
        } else {
            /* height = scroll position - height of menus */
            height = window.scrollY - offsetHeight + 'px';
        }

        document.getElementById('left-side').style.top = height;
    });
} catch (stickyNavErr) {
    console.error(stickyNavErr);
}
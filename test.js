try {
    var courseNumber = document.location.pathname.split('/')[2];
    /* If we know the course number And we're inside a course */
    if (courseNumber && /\.com\/courses\/\d+/i.test(window.location.href)) {
        $.getJSON('https://' + window.location.hostname + '/api/v1/courses/' + courseNumber, function (response) {
            if (response.name && response.course_code) {
                var courseCode = response.course_code.toLowerCase().replace(/\s/g, '').split(':')[0];
                document.getElementById('wrapper').insertAdjacentHTML('afterbegin', `<div id='courseBanner' class='${courseCode}'>${response.name}</div>`);
            }
        });
    } else {
        document.querySelector('.ic-app-nav-toggle-and-crumbs').style.marginTop = '0';
    }
} catch (bannerErr) {
    console.error(bannerErr);
}
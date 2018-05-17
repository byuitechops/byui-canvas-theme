try {
    var courseNumber = document.location.pathname.split('/')[2];

    /* If we're inside a course */
    if (/\.com\/courses\/\d+/i.test(window.location.href)) {
        document.querySelector('.ic-app-nav-toggle-and-crumbs').id = 'courseBanner';
        // document.getElementById('courseBanner').style.backgroundColor = 'green';
        
        /* get width of breadcrumbs */
        var breadcrumbWidth = document.getElementById('breadcrumbs').offsetWidth;

        document.getElementById('courseBanner').style.backgroundImage = `url(https://byui.instructure.com/courses/${courseNumber}/file_contents/course%20files/template/courseBanner.jpg)`;

        document.querySelector('html').style.setProperty('--banner-fade-width', `calc(${breadcrumbWidth}px + 450px)`);
    }
} catch (bannerErr) {
    console.error(bannerErr);
}
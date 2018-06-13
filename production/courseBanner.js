try {
    var courseNumber = document.location.pathname.split('/')[2];

    /* If we're inside a course */
    if (/\.com\/courses\/\d+/i.test(window.location.href)) {
        document.querySelector('.ic-app-nav-toggle-and-crumbs').id = 'courseBanner';
        
        /* get width of breadcrumbs */
        var breadcrumbWidth = document.getElementById('breadcrumbs').offsetWidth;

        /* set background image of courseBanner */
        document.getElementById('courseBanner').style.backgroundImage = `url(https://byui.instructure.com/courses/${courseNumber}/file_contents/course%20files/template/courseBanner.jpg)`;

        /* set width dynamically */
        document.querySelector('html').style.setProperty('--banner-fade-width', `calc(${breadcrumbWidth}px + 450px)`);
        /* For browsers without CSS variable support. Thank you Edge. */
        document.querySelector('head').insertAdjacentHTML('beforeend', `<style type='text/css'>
        .ic-app-nav-toggle-and-crumbs::before {
            width: calc(${breadcrumbWidth}px + 450px);
        }
        </style>`);
    }
} catch (bannerErr) {
    console.error(bannerErr);
}
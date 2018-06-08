/*eslint-env node, browser, jquery, es6*/

document.addEventListener('DOMContentLoaded', () => {
    /* Insert copyright footer */
    try {
        var p = document.createElement('p');
        p.innerHTML = 'Copyright ' + new Date().getFullYear() + ' Brigham Young University-Idaho';
        p.classList.add('copyright');
        var page = document.getElementById('content');
        if (page) {
            page.appendChild(p);
        } else {
            console.log('unable to add copyright footer to page');
        }
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


/********************************************
 * Keep the course nav even on scroll down 
 *******************************************/

/* scroll differently if you're on a manage files page */
const filesPage = /(\.com|\d+)\/files($|\/folder)/i.test(window.location.href),
    courseMenu = document.getElementById('left-side');
/* Calculating this value by hand requires a dependency on complex CSS selectors 
every time the event fires, which is why it's hard coded */
var offsetHeight = 63, // 113px is height of courseBanner(50px) + canvas breadcrumb nav(63px)
    busy = false,
    height;

function calcHeight() {
    /* Set the height */
    if (filesPage) {
        /* nav offset is different for files pages */
        height = `${window.scrollY}px`;
    } else if (window.scrollY < offsetHeight) {
        /* if you're at the top of the page don't mess with the offset */
        height = '0px';
    } else {
        /* height = scroll position - height of menus */
        height = `${window.scrollY - offsetHeight}px`;
    }
}

function onScroll() {
    calcHeight();
    /* check if busy */
    if (!busy) {
        updateMenuPosition();
    }
    busy = true;
}

function updateMenuPosition() {
    requestAnimationFrame(() => {
        busy = false;
        courseMenu.style.top = height;
    });
}

try {
    document.addEventListener('scroll', onScroll);
    /* set nav offset */
} catch (stickyNavErr) {
    console.error(stickyNavErr);
}
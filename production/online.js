/*eslint-env node, browser, jquery, es6*/
function addCopyrightFooter() {
    try {
        var page = document.getElementById('content');
        if (page) {
            page.insertAdjacentHTML('beforeend', '<p class=\'copyright\'>Copyright ' + new Date().getFullYear() + ' Brigham Young University-Idaho</p>');
        } else {
            console.error('unable to add copyright footer to page');
        }
    } catch (copyrightErr) {
        console.error(copyrightErr);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    /* Insert copyright footer */
    addCopyrightFooter();

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

    /* Add pre > code highlighting */
    try {
        var meh = document.querySelector('code[class*="language-"]');
        if (meh) {
            var jsEle = document.createElement('script');
            var cssEle = document.createElement('link');
            jsEle.src = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js';
            cssEle.href = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css';
            cssEle.rel = 'stylesheet';
            document.head.appendChild(jsEle);
            document.head.appendChild(cssEle);
        }
    } catch (preCodeErr) {
        console.error(preCodeErr);
    }
});

/********************************************
 * Keep the course nav even on scroll down 
 *******************************************/

/* scroll differently if you're on a manage files page */
var filesPage = /(\.com|\d+)\/files($|\/folder)/i.test(window.location.href),
    courseMenu = document.getElementById('left-side');

// offsetHeight isn't worth trying to calculate
var offsetHeight = 63,
    // 113px is height of courseBanner(50px) + canvas breadcrumb nav(63px)
busy = false,
    height;

/*********************************
 * Calc the top value of the nav
 *********************************/
function calcHeight() {
    if (filesPage) {
        /* nav offset is different for files pages */
        height = window.scrollY + 'px';
    } else if (window.scrollY < offsetHeight) {
        /* if you're at the top of the page don't mess with the offset */
        height = '0px';
    } else {
        /* height = scroll position - height of any items above nav */
        height = window.scrollY - offsetHeight + 'px';
    }
}

/*********************************************************
 * Calc the new height of the nav.
 * Update page if not already waiting for the next frame
 *********************************************************/
function onScroll() {
    calcHeight();
    if (!busy) {
        updateMenuPosition();
    }
    busy = true;
}

/***********************************************
 * Update top value when the next frame loads
 **********************************************/
function updateMenuPosition() {
    requestAnimationFrame(function () {
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

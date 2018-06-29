/*eslint-env node, browser, jquery, es6*/

/***************************
 * Insert copyright footer 
 ***************************/
function addCopyrightFooter() {
    try {
        var page = document.getElementById('content');
        if (page) {
            page.insertAdjacentHTML('beforeend', `<p class='copyright'>Copyright ${new Date().getFullYear()} Brigham Young University-Idaho</p>`);
        } else {
            console.error('unable to add copyright footer to page');
        }
    } catch (copyrightErr) {
        console.error(copyrightErr);
    }
}

/*******************************
 * Add pre > code highlighting 
 *******************************/
function addCodeHighlight() {
    try {
        /* determine if we need to load the code highlighting library */
        var codeExists = document.querySelector('code[class*="language-"]');
        if (codeExists) {
            var jsEle = document.createElement('script'),
                cssEle = document.createElement('link');
            jsEle.src = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js';
            cssEle.href = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css';
            cssEle.rel = 'stylesheet';
            document.head.appendChild(jsEle);
            document.head.appendChild(cssEle);
        }
    } catch (preCodeErr) {
        console.error(preCodeErr);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addCopyrightFooter();
    addCodeHighlight();
});
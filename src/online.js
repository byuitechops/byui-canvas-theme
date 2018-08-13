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

document.addEventListener('DOMContentLoaded', () => {
    addCopyrightFooter();
});
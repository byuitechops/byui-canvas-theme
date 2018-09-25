/* eslint-env browser */

document.addEventListener('DOMContentLoaded', main);
const port = '8000';

function main() {
    var s = document.createElement('script');
    s.href = `http://localhost:${port}/byui.js`;
    document.appendChild(s);
    console.log(`script appended. Please use port: ${port}`);
}
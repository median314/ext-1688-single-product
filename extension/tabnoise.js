/* eslint-disable no-undef */

var s = document.createElement('script');
localStorage.setItem('interceptedArr', JSON.stringify([]));

const host = window.location.host;
if (host === 'https://detail.1688.com/*') {
    s.src = chrome.runtime.getURL('contentScript.js');
}

s.async = true;
s.referrerPolicy = 'same-origin';

s.onload = function() {
    // this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.getResponse) {
        let wholeArr = JSON.parse(localStorage.getItem('interceptedArr'));
        localStorage.setItem('interceptedArr', JSON.stringify([]));
        if (wholeArr[0]) {
            chrome.runtime.sendMessage({ results: wholeArr });
        }
    }
});

/* eslint-disable no-unused-vars */
let initiated = false; // Menonaktifkan peringatan untuk variabel tidak digunakan
/* eslint-enable no-unused-vars */
